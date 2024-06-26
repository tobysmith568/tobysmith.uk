import { PageMetaObject } from "./meta.po";

export class CookiesPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/cookies");
  }

  getTitle() {
    return cy.get("h1");
  }

  getUpdateSentence() {
    return cy.get("p:contains('Our Cookies Policy was last updated on 17th March 2024.')");
  }
}
