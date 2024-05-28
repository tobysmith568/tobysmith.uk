import { ThirdPartyPageObject } from "../page-objects/third-party.po";

describe("Third Party Page", () => {
  const thirdPartyPage = new ThirdPartyPageObject();

  it("should display the title", () => {
    thirdPartyPage.visit();

    thirdPartyPage.getTitle().should("have.text", "Third-party Content");
  });

  it("should display the generate license file credit", () => {
    thirdPartyPage.visit();

    thirdPartyPage.getGenerateLicenseFileCredit().should("exist");
  });
});
