import { GenerateLicenseFileProjectPageObject } from "../../page-objects/projects/generate-license-file.po";

describe("Generate License File Project", () => {
  const projectPage = new GenerateLicenseFileProjectPageObject();

  it("should display the back link", () => {
    projectPage.visit();

    const backLink = projectPage.getBackLink();

    backLink
      .should("exist")
      .and("contain.text", "My Projects")
      .and("have.attr", "href", "/projects");
  });

  it("should display the image", () => {
    projectPage.visit();

    const image = projectPage.details.getImage();

    image
      .should("exist")
      .and("be.visible")
      .then(img => expect((img[0] as any)?.["naturalWidth"]).to.be.greaterThan(0));
  });

  it("should display the title", () => {
    projectPage.visit();

    const title = projectPage.details.getTitle();

    title.should("exist").and("contain.text", "Generate License File");
  });

  it("should display the tag line", () => {
    projectPage.visit();

    const tagLine = projectPage.details.getTagLine();

    tagLine
      .should("exist")
      .and(
        "contain.text",
        "Generate a text file containing all of the licences for your production, third-party dependencies."
      );
  });

  it("should display the content", () => {
    projectPage.visit();

    const content = projectPage.getContent();

    content
      .should("exist")
      .and(
        "contain.text",
        "Using packages of software created by others is a great way to develop your projects"
      );
  });
});
