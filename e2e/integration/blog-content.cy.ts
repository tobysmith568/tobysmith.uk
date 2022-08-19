describe("Blog form", () => {
  it("Can get blog content from the graphql api", () => {
    cy.visit("/blog");

    cy.get(`h2:contains("I Graduated!")`).should("exist").click();

    cy.get(`h1:contains("I Graduated!")`).should("exist");
    cy.get(`h3:contains("01 Jul 2020")`).should("exist");
    cy.get(`p:contains("After four years")`).should("exist");
  });

  it("Shows the Disqus iframe beneath blog content", () => {
    cy.visit("/blog");

    cy.get(`h2:contains("I Graduated!")`).should("exist").click();

    cy.get(`iframe[title="Disqus"]`).should("exist");
  });
});

export {};
