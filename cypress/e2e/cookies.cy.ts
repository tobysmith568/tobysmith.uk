import { CookiesPageObject } from "../page-objects/cookies.po";

describe("Cookies Page", () => {
  const cookiesPage = new CookiesPageObject();

  it("should have the correct meta tags", () => {
    cookiesPage.visit();

    cookiesPage.meta.getTitle().should("equal", "Cookies Policy - Toby Smith");
    cookiesPage.meta.getMetaDescription().should("equal", "The cookies policy for tobysmith.uk");
  });

  it("should display the title", () => {
    cookiesPage.visit();

    cookiesPage.getTitle().should("have.text", "Cookies Policy");
  });

  it("should display the last update sentence", () => {
    cookiesPage.visit();

    cookiesPage.getUpdateSentence().should("exist");
  });
});
