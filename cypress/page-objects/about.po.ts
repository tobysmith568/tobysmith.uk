export class AboutPageObject {
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
