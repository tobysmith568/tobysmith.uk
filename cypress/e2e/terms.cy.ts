import { TermsPageObject } from "../page-objects/terms.po";

describe("Terms Page", () => {
  const termsPage = new TermsPageObject();

  it("should have the correct meta tags", () => {
    termsPage.visit();

    termsPage.meta.getTitle().should("equal", "Terms & Conditions - Toby Smith");
    termsPage.meta.getMetaDescription().should("equal", "The Terms & Conditions for tobysmith.uk");
  });

  it("should display the title", () => {
    termsPage.visit();

    termsPage.getTitle().should("have.text", "Terms and Conditions (“Terms”)");
  });

  it("should display the last update sentence", () => {
    termsPage.visit();

    termsPage.getUpdateSentence().should("exist");
  });
});
