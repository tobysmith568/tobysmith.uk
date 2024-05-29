import { PageMetaObject } from "./meta.po";

export class ThirdPartyPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/third-party");
  }

  getTitle() {
    return cy.get("h1");
  }

  getGenerateLicenseFileCredit() {
    return cy.get("p:contains('This content was generated using the')");
  }
}
