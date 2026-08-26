describe("Contact Redirect", () => {
  it("should redirect /contact to /#contact", () => {
    cy.visit("/contact");

    cy.location("pathname").should("equal", "/");
    cy.location("hash").should("equal", "#contact");
  });
});
