import { describe, expect, it } from "vitest";
import { actOnLesson } from "../index.server";

describe("lesson actions", () => {
  it.each([null, "", "unknown-action"])(
    "rejects an unsupported intent (%s) before accessing course data",
    async (intent) => {
      const form = new FormData();
      if (intent !== null) form.set("intent", intent);
      const request = new Request("http://localhost/courses/test/lessons/1", {
        method: "POST",
        body: form,
      });

      await expect(
        actOnLesson({ params: { slug: "test", lessonId: "1" }, request })
      ).rejects.toMatchObject({
        init: { status: 400 },
        data: "Invalid action",
      });
    }
  );
});
