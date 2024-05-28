export class PrivacyPageObject {
  visit() {
    cy.visit("/privacy");
  }

  getTitle() {
    return cy.get("h1");
  }

  getUpdateSentence() {
    return cy.get("p:contains('Our Privacy Policy was last updated on 17th March 2024.')");
  }
}
