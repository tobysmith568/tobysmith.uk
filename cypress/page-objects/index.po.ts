import { PageMetaObject } from "./meta.po";

export class IndexPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/");
  }

  getTitle() {
    return cy.get("h1");
  }

  getSubtitle() {
    return cy.get("h2");
  }

  getTagLine() {
    return cy.get("#tag");
  }

  getProfilePicture() {
    return cy.get("img.profile-pic");
  }
}
