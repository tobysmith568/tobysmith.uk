export class ProjectsPageObject {
  visit() {
    cy.visit("/projects");
  }

  getTitle() {
    return cy.get("h1");
  }

  getProjects() {
    return cy.get("article");
  }
}
