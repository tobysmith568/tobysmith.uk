import { IndexPageObject } from "../page-objects/index.po";

describe("Index", () => {
  const indexPage = new IndexPageObject();

  it("should render the home page", () => {
    indexPage.visit();

    const title = indexPage.getTitle();
    title.should("exist").and("contain.text", "Toby Smith");

    const subtitle = indexPage.getSubtitle();
    subtitle.should("exist").and("contain.text", "Blog and Portfolio Website");
  });

  it("should cycle through the tag lines", () => {
    cy.clock();

    indexPage.visit();
    cy.tick(1000);

    const tag1 = indexPage.getTagLine();
    tag1.should("exist").and("contain.text", "Full-stack developer");

    cy.tick(3000);

    const tag2 = indexPage.getTagLine();
    tag2.should("exist").and("contain.text", "npm package author");

    cy.tick(3000);

    const tag3 = indexPage.getTagLine();
    tag3.should("exist").and("contain.text", "TypeScript fanatic");

    cy.tick(3000);

    const tag4 = indexPage.getTagLine();
    tag4.should("exist").and("contain.text", "Burrito over-filler");

    cy.tick(3000);

    const tag1Again = indexPage.getTagLine();
    tag1Again.should("exist").and("contain.text", "Full-stack developer");
  });

  it("should load the profile picture", () => {
    indexPage.visit();

    const profilePic = indexPage.getProfilePicture();

    profilePic
      .should("exist")
      .and("be.visible")
      .then(img => expect((img[0] as any)?.["naturalWidth"]).to.be.greaterThan(0));
  });
});
