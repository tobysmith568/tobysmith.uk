import { AboutPageObject } from "../page-objects/about.po";

describe("About Page", () => {
  const aboutPage = new AboutPageObject();

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
