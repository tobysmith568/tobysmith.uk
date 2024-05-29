import { ProjectsPageObject } from "../page-objects/projects.po";

describe("Projects Page", () => {
  const projectsPage = new ProjectsPageObject();

  it("should have the correct meta tags", () => {
    projectsPage.visit();

    projectsPage.meta.getTitle().should("equal", "My Projects - Toby Smith");
    projectsPage.meta
      .getMetaDescription()
      .should("equal", "A selection of the projects Toby has been working on recently.");
  });

  it("should display the projects page", () => {
    projectsPage.visit();

    const title = projectsPage.getTitle();

    title.should("exist").and("contain.text", "My Projects");
  });

  it("should display the projects", () => {
    projectsPage.visit();

    const projects = projectsPage.getProjects();

    projects.should("have.length", 4);
  });

  it("should display the projects in order", () => {
    projectsPage.visit();

    const projectTitles = ["Generate License File", "License Cop", "Which Node.JS", "Read Receipt"];

    const projects = projectsPage.getProjects();

    projects.each(($project, index) => {
      cy.wrap($project).find("h2").should("contain.text", projectTitles[index]);
    });
  });

  it("should navigate to the project page", () => {
    projectsPage.visit();

    const projectSlugs = ["generate-license-file", "license-cop", "which-node-js", "read-receipt"];

    const projects = projectsPage.getProjects();

    projects.each(($project, index) => {
      cy.wrap($project).find("a").should("have.attr", "href", `/projects/${projectSlugs[index]}`);
    });
  });
});
