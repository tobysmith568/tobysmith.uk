import { PageMetaObject } from "../meta.po";

export class GraduatedBlogPostPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/blog/graduated");
  }

  getTitle() {
    return cy.get("h1");
  }

  getDate() {
    return cy.get("time");
  }

  getContent() {
    return cy.get("div.prose");
  }

  getBackLink() {
    return cy.get("a.back");
  }
}
