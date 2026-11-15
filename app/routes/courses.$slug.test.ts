import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb, seedBaseData, type TestDb } from "~/test/setup";
import * as schema from "~/db/schema";
import { setCurrentUserId } from "~/lib/session";

let db: TestDb;
vi.mock("~/db", () => ({
  db: new Proxy(
    {},
    {
      get(_target, property) {
        const value = Reflect.get(db, property);
        return typeof value === "function" ? value.bind(db) : value;
      },
    }
  ),
}));

const { loader } = await import("./courses.$slug");
const slug = "building-rest-apis-with-nodejs";
let base: ReturnType<typeof seedBaseData>;

beforeEach(() => {
  db = createTestDb();
  base = seedBaseData(db);
  db.update(schema.courses)
    .set({ slug, title: "Building REST APIs with Node.js" })
    .where(eq(schema.courses.id, base.course.id))
    .run();
});

afterEach(() => {
  db.$client.close();
});

async function load(userId?: number, courseSlug = slug) {
  const url = `http://localhost/courses/${courseSlug}`;
  const cookie = userId ? await setCurrentUserId(new Request(url), userId) : "";
  return loader({
    request: new Request(url, { headers: { Cookie: cookie } }),
    params: { slug: courseSlug },
    context: {},
  } as Parameters<typeof loader>[0]);
}

describe("reported REST APIs course page", () => {
  it("loads course data and sales copy for a signed-out visitor", async () => {
    const result = await load();
    expect(result.course.slug).toBe(slug);
    expect(result.salesCopyHtml).toContain("Sales copy for the test course.");
    expect(result.enrolled).toBe(false);
    expect(result.canTake).toBe(false);
    expect(result.currentUserId).toBeNull();
    expect(result.ratingSummary).toEqual({ average: null, count: 0 });
    expect(result.userRating).toBeNull();
  });

  it("loads for a signed-in visitor without an enrollment", async () => {
    const result = await load(base.user.id);
    expect(result.currentUserId).toBe(base.user.id);
    expect(result.enrolled).toBe(false);
    expect(result.refundOffer).toBeNull();
  });

  it("loads progress for an enrolled student without a purchase", async () => {
    db.insert(schema.enrollments)
      .values({ userId: base.user.id, courseId: base.course.id })
      .run();
    const module = db
      .insert(schema.modules)
      .values({
        courseId: base.course.id,
        title: "API Fundamentals",
        position: 1,
      })
      .returning()
      .get();
    const [completed, next] = db
      .insert(schema.lessons)
      .values([
        { moduleId: module.id, title: "REST", position: 1 },
        { moduleId: module.id, title: "Express", position: 2 },
      ])
      .returning()
      .all();
    if (!completed || !next)
      throw new Error("Lesson fixtures were not created");
    db.insert(schema.lessonProgress)
      .values({
        userId: base.user.id,
        lessonId: completed.id,
        status: schema.LessonProgressStatus.Completed,
      })
      .run();

    const result = await load(base.user.id);
    expect(result.canTake).toBe(true);
    expect(result.lessonCount).toBe(2);
    expect(result.progress).toBe(50);
    expect(result.nextLessonId).toBe(next.id);
    expect(result.lessonProgressMap).toEqual({ [completed.id]: "completed" });
    expect(result.refundOffer).toBeNull();
  });

  it("throws a 404 rather than returning an error-shaped success", async () => {
    await expect(load(undefined, "missing-course")).rejects.toMatchObject({
      init: { status: 404 },
      data: "Course not found",
    });
  });
});
