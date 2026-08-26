import { IndexPageObject } from "../page-objects/index.po";

describe("Index", () => {
  const indexPage = new IndexPageObject();

  it("should have the correct meta tags", () => {
    indexPage.visit();

    indexPage.meta.getTitle().should("equal", "Toby Smith");
    indexPage.meta
      .getMetaDescription()
      .should(
        "equal",
        "Toby Smith is a London-based software developer who enjoys focusing on web-based technologies."
      );
  });

  it("should render the home page", () => {
    indexPage.visit();

    const title = indexPage.getTitle();
    title.should("exist").and("contain.text", "Toby Smith");

    const subtitle = indexPage.getSubtitle();
    subtitle.should("exist").and("contain.text", "Blog and Portfolio Website");
  });

  it("should cycle through the tag lines", () => {
    cy.clock();

    indexPage.visit();
    cy.tick(1000);

    const tag1 = indexPage.getTagLine();
    tag1.should("exist").and("contain.text", "Full-stack developer");

    cy.tick(3000);

    const tag2 = indexPage.getTagLine();
    tag2.should("exist").and("contain.text", "npm package author");

    cy.tick(3000);

    const tag3 = indexPage.getTagLine();
    tag3.should("exist").and("contain.text", "TypeScript fanatic");

    cy.tick(3000);

    const tag4 = indexPage.getTagLine();
    tag4.should("exist").and("contain.text", "Burrito over-filler");

    cy.tick(3000);

    const tag1Again = indexPage.getTagLine();
    tag1Again.should("exist").and("contain.text", "Full-stack developer");
  });

  it("should load the profile picture", () => {
    indexPage.visit();

    const profilePic = indexPage.getProfilePicture();

    profilePic
      .should("exist")
      .and("be.visible")
      .then(img => expect((img[0] as any)?.["naturalWidth"]).to.be.greaterThan(0));
  });

  it("should display the about section", () => {
    indexPage.visit();

    const aboutHeading = indexPage.getAboutHeading();
    aboutHeading.should("exist").and("contain.text", "About Me");
  });

  it("should display the contact section", () => {
    indexPage.visit();

    const contactHeading = indexPage.getContactHeading();
    contactHeading.should("exist").and("contain.text", "Contact Me");

    const contactMessage = indexPage.getContactMessage();
    contactMessage.should("exist").and("contain.text", "Feel free to reach out me");
  });

  it("should display the full contact form", () => {
    indexPage.visit();

    const nameInput = indexPage.form.getNameInput();
    const emailInput = indexPage.form.getEmailInput();
    const messageInput = indexPage.form.getMessageInput();
    const submitButton = indexPage.form.getSubmitButton();

    nameInput.should("exist").and("be.visible");
    emailInput.should("exist").and("be.visible");
    messageInput.should("exist").and("be.visible");
    submitButton.should("exist").and("be.visible");
  });

  it("should show the submit button as disabled when the form is empty", () => {
    indexPage.visit();

    const submitButton = indexPage.form.getSubmitButton();

    submitButton.should("be.disabled");
  });

  it("should enable the submit button when the form is filled out", () => {
    indexPage.visit();

    indexPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = indexPage.form.getSubmitButton();
    submitButton.should("not.be.disabled");
  });

  it("should post the email on form submit", () => {
    indexPage.form.interceptAndStubFormSubmission(204);

    indexPage.visit();

    indexPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = indexPage.form.getSubmitButton();
    submitButton.click();

    indexPage.form.getFormSubmission().then(({ request }) => {
      const { name, email, message, turnstileToken } = request.body;

      expect(name).to.equal("My Name");
      expect(email).to.equal("my.name@test.com");
      expect(message).to.equal("Hello, this is a test message");
      expect(turnstileToken).to.exist;
    });
  });

  it("should show a success message on successful form submission", () => {
    indexPage.form.interceptAndStubFormSubmission(204);

    indexPage.visit();

    indexPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = indexPage.form.getSubmitButton();
    submitButton.click();

    indexPage.form.getFormSubmission().then(() => {
      const successMessage = indexPage.form.getFormResultMessage();

      successMessage.should("exist").and("contain.text", "Message sent successfully!");
    });
  });

  it("should show an error message on failed form submission", () => {
    indexPage.form.interceptAndStubFormSubmissionWithMessage(500, "Message failed to send");

    indexPage.visit();

    indexPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = indexPage.form.getSubmitButton();
    submitButton.click();

    indexPage.form.getFormSubmission().then(() => {
      const errorMessage = indexPage.form.getFormResultMessage();

      errorMessage.should("exist").and("contain.text", "Message failed to send");
    });
  });
});
