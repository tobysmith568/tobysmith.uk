import { PageMetaObject } from "../meta.po";

export class GenerateLicenseFileProjectPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/projects/generate-license-file");
  }

  details = new DetailsPageObject();

  getContent() {
    return cy.get("div.prose");
  }

  getBackLink() {
    return cy.get("a.back");
  }
}

class DetailsPageObject {
  getImage() {
    return this.withinDetails().get("img");
  }

  getTitle() {
    return this.withinDetails().get("h1");
  }

  getTagLine() {
    return this.withinDetails().get("p.tagline");
  }

  private withinDetails() {
    return cy.get("div.details");
  }
}
