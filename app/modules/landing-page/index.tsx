import { ArrowRight, BookOpen, Check, GraduationCap } from "lucide-react";
import { Link } from "react-router";

type Totals = { totalCourses: number; totalCategories: number };

export function LandingIntro(totals: Totals) {
  return (
    <section
      aria-labelledby="landing-title"
      className="border-b border-border bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Hero />
          <LearningJourney />
        </div>
        <CourseStatistics {...totals} />
      </div>
    </section>
  );
}

function Hero() {
  return (
    <div className="text-left">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Build skills. Keep moving.
      </p>
      <h1
        id="landing-title"
        className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
      >
        Learn to code,
        <br />
        <span className="text-primary">at your own pace.</span>
      </h1>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Structured courses built by experienced instructors. Track your
        progress, take quizzes, and build real-world skills.
      </p>
      <Link
        to="/courses"
        className="mt-8 inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Browse Courses
        <ArrowRight className="ml-2 size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

const journey = [
  {
    Icon: BookOpen,
    title: "Find your focus",
    detail: "Explore courses built around real-world skills.",
  },
  {
    Icon: GraduationCap,
    title: "Learn by doing",
    detail: "Work through lessons and test yourself with quizzes.",
  },
  {
    Icon: Check,
    title: "Make it a habit",
    detail: "Track your progress, one lesson at a time.",
  },
];

function LearningJourney() {
  return (
    <aside
      aria-label="Your learning journey"
      className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Your next chapter
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        A little progress.
        <br />A lasting skill.
      </h2>
      <ol className="mt-8 space-y-6">
        {journey.map(({ Icon, title, detail }) => (
          <li key={title} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function CourseStatistics({ totalCourses, totalCategories }: Totals) {
  return (
    <dl className="mt-12 grid gap-6 border-t border-border pt-8 text-left sm:grid-cols-3 sm:gap-8">
      <div>
        <dt className="text-sm text-muted-foreground">Available Courses</dt>
        <dd className="mt-1 text-2xl font-semibold">{totalCourses}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Categories</dt>
        <dd className="mt-1 text-2xl font-semibold">{totalCategories}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">
          Learn on your schedule
        </dt>
        <dd className="mt-1 text-2xl font-semibold">Self-paced</dd>
      </div>
    </dl>
  );
}
