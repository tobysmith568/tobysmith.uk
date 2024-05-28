import { PrivacyPageObject } from "../page-objects/privacy.po";

describe("Privacy Page", () => {
  const privacyPage = new PrivacyPageObject();

  it("should display the title", () => {
    privacyPage.visit();

    privacyPage.getTitle().should("have.text", "Privacy Policy");
  });

  it("should display the last update sentence", () => {
    privacyPage.visit();

    privacyPage.getUpdateSentence().should("exist");
  });
});
