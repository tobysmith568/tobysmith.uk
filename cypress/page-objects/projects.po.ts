import { PageMetaObject } from "./meta.po";

export class ProjectsPageObject {
  meta = new PageMetaObject();

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
