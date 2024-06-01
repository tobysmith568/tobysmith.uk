import { PageMetaObject } from "./meta.po";

export class AboutPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/about");
  }

  getTitle() {
    return cy.get("h1");
  }

  getProfilePicture() {
    return cy.get("img");
  }
}
