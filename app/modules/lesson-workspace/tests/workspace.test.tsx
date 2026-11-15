import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps } from "react";
import { LessonWorkspace } from "../index";

const state = vi.hoisted(() => ({
  state: "idle",
  data: undefined as undefined | { ok: boolean; error?: string },
}));
vi.mock("react-router", () => ({
  useFetcher: () => ({ ...state, Form: "form" }),
}));

function render(note: ComponentProps<typeof LessonWorkspace>["note"]) {
  return renderToStaticMarkup(
    <LessonWorkspace
      note={note}
      discussion={<h2>Questions &amp; Discussion</h2>}
    />
  );
}

beforeEach(() => {
  state.state = "idle";
  state.data = undefined;
});

describe("lesson workspace", () => {
  it("keeps discussion available without exposing an editor to signed-out visitors", () => {
    const html = render(undefined);
    expect(html).toContain("Questions &amp; Discussion");
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain("Your notes");
  });

  it("groups a labelled private editor with discussion for a new note", () => {
    const html = render(null);
    expect(html).toContain('aria-labelledby="lesson-notes-heading"');
    expect(html).toContain(
      '<label for="lesson-note-body" class="sr-only">Your notes</label>'
    );
    expect(html).toContain('aria-describedby="lesson-notes-privacy"');
    expect(html).toContain("Private — only you can read these.");
    expect(html).toContain('name="intent" value="save-note"');
    expect(html).toContain('name="body"');
    expect(html).toContain("Save notes");
    expect(html).not.toContain('disabled=""');
    expect(html).not.toContain("Last edited");
    expect(html).toMatch(/<textarea[^>]*><\/textarea>/);
    expect(html.indexOf("Your notes")).toBeLessThan(
      html.indexOf("Questions &amp; Discussion")
    );
  });

  it("shows saved text and its edit time without interpreting markup", () => {
    const html = render({
      body: "<script>example</script>",
      updatedAt: "2026-01-01T00:00:00Z",
    });
    expect(html).toContain("&lt;script&gt;example&lt;/script&gt;");
    expect(html).toContain("Last edited");
  });

  it.each(["submitting", "loading"])("disables saving while %s", (status) => {
    state.state = status;
    const html = render(null);
    expect(html).toContain('disabled=""');
    expect(html).toContain("Saving...");
    expect(html).not.toContain("Save notes");
  });

  it("announces save errors rather than implying that the note was saved", () => {
    state.data = {
      ok: false,
      error: "Write something before saving your note.",
    };
    const html = render({
      body: "old note",
      updatedAt: "2026-01-01T00:00:00Z",
    });
    expect(html).toContain('role="alert"');
    expect(html).toContain(state.data.error);
    expect(html).not.toContain("Last edited");
    expect(html).toContain("old note");
  });
});
