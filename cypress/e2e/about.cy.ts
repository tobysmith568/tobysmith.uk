import { AboutPageObject } from "../page-objects/about.po";

describe("About Page", () => {
  const aboutPage = new AboutPageObject();

  it("should have the correct meta tags", () => {
    aboutPage.visit();

    aboutPage.meta.getTitle().should("equal", "About - Toby Smith");
    aboutPage.meta
      .getMetaDescription()
      .should(
        "equal",
        "Toby Smith is a London-based software developer who enjoys focusing on web-based technologies."
      );
  });

  it("should display the about page", () => {
    aboutPage.visit();

    const title = aboutPage.getTitle();

    title.should("exist").and("contain.text", "Hey, I’m Toby");
  });

  it("should load the profile picture", () => {
    aboutPage.visit();

    const profilePic = aboutPage.getProfilePicture();

    profilePic
      .should("exist")
      .and("be.visible")
      .then(img => expect((img[0] as any)?.["naturalWidth"]).to.be.greaterThan(0));
  });
});
