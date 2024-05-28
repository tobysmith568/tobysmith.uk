export class ThirdPartyPageObject {
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
