import { TermsPageObject } from "../page-objects/terms.po";

describe("Terms Page", () => {
  const termsPage = new TermsPageObject();

  it("should display the title", () => {
    termsPage.visit();

    termsPage.getTitle().should("have.text", "Terms and Conditions (“Terms”)");
  });

  it("should display the last update sentence", () => {
    termsPage.visit();

    termsPage.getUpdateSentence().should("exist");
  });
});
