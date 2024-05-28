export class TermsPageObject {
  visit() {
    cy.visit("/terms");
  }

  getTitle() {
    return cy.get("h1");
  }

  getUpdateSentence() {
    return cy.get("p:contains('Our Terms and Conditions were last updated on 17th March 2024.')");
  }
}
