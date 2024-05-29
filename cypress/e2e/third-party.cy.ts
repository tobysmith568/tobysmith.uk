import { ThirdPartyPageObject } from "../page-objects/third-party.po";

describe("Third Party Page", () => {
  const thirdPartyPage = new ThirdPartyPageObject();

  it("should have the correct meta tags", () => {
    thirdPartyPage.visit();

    thirdPartyPage.meta.getTitle().should("equal", "Third-Party Content - Toby Smith");
    thirdPartyPage.meta
      .getMetaDescription()
      .should("equal", "The Third-party content used by tobysmith.uk");
  });

  it("should display the title", () => {
    thirdPartyPage.visit();

    thirdPartyPage.getTitle().should("have.text", "Third-party Content");
  });

  it("should display the generate license file credit", () => {
    thirdPartyPage.visit();

    thirdPartyPage.getGenerateLicenseFileCredit().should("exist");
  });
});
