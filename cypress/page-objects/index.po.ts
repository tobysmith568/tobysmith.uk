import { ContactFormPageObject } from "./contact.po";
import { PageMetaObject } from "./meta.po";

export class IndexPageObject {
  meta = new PageMetaObject();
  form = new ContactFormPageObject();

  visit() {
    cy.visit("/");
  }

  getTitle() {
    return cy.get("h1");
  }

  getSubtitle() {
    return cy.get("h2.tagline");
  }

  getTagLine() {
    return cy.get("#tag");
  }

  getProfilePicture() {
    return cy.get("img.profile-pic");
  }

  getAboutHeading() {
    return cy.get("#about h2");
  }

  getContactHeading() {
    return cy.get("#contact h2");
  }

  getContactMessage() {
    return cy.get("#contact p").first();
  }
}
