import type { ReactNode } from "react";
import { useFetcher } from "react-router";
import { LockKeyhole, NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { formatRelativeTime } from "~/lib/utils";

type Note = { body: string; updatedAt: string } | null;

export function LessonWorkspace({
  note,
  discussion,
}: {
  // Undefined means the visitor is signed out; null means no note yet.
  note: Note | undefined;
  discussion: ReactNode;
}) {
  return (
    <div className="mb-8 grid items-start gap-6 border-t pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      {note !== undefined && <NoteEditor note={note} />}
      <div className="min-w-0 lg:last:first:col-span-2">{discussion}</div>
    </div>
  );
}

function NoteFeedback({ error, note }: { error?: string; note: Note }) {
  if (error)
    return (
      <span role="alert" className="text-sm text-red-600">
        {error}
      </span>
    );
  if (!note) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Last edited {formatRelativeTime(note.updatedAt)}
    </span>
  );
}

function NoteEditor({ note }: { note: Note }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.data?.error;

  return (
    <section
      aria-labelledby="lesson-notes-heading"
      className="min-w-0 rounded-xl border bg-muted/20 p-5"
    >
      <div className="mb-1 flex items-center gap-2">
        <NotebookPen
          aria-hidden="true"
          className="size-5 text-muted-foreground"
        />
        <h2 id="lesson-notes-heading" className="text-xl font-semibold">
          Your notes
        </h2>
      </div>
      <p
        id="lesson-notes-privacy"
        className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <LockKeyhole aria-hidden="true" className="size-3" />
        Private — only you can read these.
      </p>
      <fetcher.Form method="post" className="space-y-3">
        <input type="hidden" name="intent" value="save-note" />
        <label htmlFor="lesson-note-body" className="sr-only">
          Your notes
        </label>
        <Textarea
          id="lesson-note-body"
          aria-describedby="lesson-notes-privacy"
          name="body"
          rows={8}
          defaultValue={note?.body ?? ""}
          placeholder="Capture a takeaway, a code snippet, or something to revisit…"
          className="resize-y bg-background leading-relaxed"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save notes"}
          </Button>
          <NoteFeedback error={error} note={note} />
        </div>
      </fetcher.Form>
    </section>
  );
}
