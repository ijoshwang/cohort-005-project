import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { LandingIntro } from "./landing-intro";

function render(totalCourses = 4, totalCategories = 5) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <LandingIntro
        totalCourses={totalCourses}
        totalCategories={totalCategories}
      />
    </MemoryRouter>
  );
}

describe("landing page introduction", () => {
  it("offers a direct route to the course catalogue", () => {
    expect(render()).toMatch(/href="\/courses"[^>]*>Browse Courses/);
  });

  it("labels the hero and explains the learning journey", () => {
    const html = render();
    expect(html).toContain('aria-labelledby="landing-title"');
    expect(html).toContain('id="landing-title"');
    expect(html).toContain("Find your focus");
    expect(html).toContain("Learn by doing");
    expect(html).toContain("Make it a habit");
  });

  it("renders supplied course and category totals rather than marketing placeholders", () => {
    const html = render(12, 7);
    expect(html).toMatch(/Available Courses<\/dt><dd[^>]*>12<\/dd>/);
    expect(html).toMatch(/Categories<\/dt><dd[^>]*>7<\/dd>/);
    expect(html).toContain("Self-paced");
  });

  it("supports an empty catalogue without inventing counts", () => {
    expect(render(0, 0).match(/>0<\/dd>/g)).toHaveLength(2);
    expect(render(0, 0)).toContain('href="/courses"');
  });
});
