import { ContactPageObject } from "../page-objects/contact.po";

describe("Contact Page", () => {
  const contactPage = new ContactPageObject();

  it("should have the correct meta tags", () => {
    contactPage.visit();

    contactPage.meta.getTitle().should("equal", "Contact Me - Toby Smith");
    contactPage.meta
      .getMetaDescription()
      .should("equal", "Contact Toby Smith using the message form below or on LinkedIn.");
  });

  it("should display the contact page", () => {
    contactPage.visit();

    const title = contactPage.getTitle();

    title.should("exist").and("contain.text", "Contact Me");
  });

  it("should display the contact message", () => {
    contactPage.visit();

    const contactMessage = contactPage.getContactMessage();

    contactMessage.should("exist").and("contain.text", "Feel free to reach out me");
  });

  it("should display the full contact form", () => {
    contactPage.visit();

    const nameInput = contactPage.form.getNameInput();
    const emailInput = contactPage.form.getEmailInput();
    const messageInput = contactPage.form.getMessageInput();
    const submitButton = contactPage.form.getSubmitButton();

    nameInput.should("exist").and("be.visible");
    emailInput.should("exist").and("be.visible");
    messageInput.should("exist").and("be.visible");
    submitButton.should("exist").and("be.visible");
  });

  it("should show the submit button as disabled when the form is empty", () => {
    contactPage.visit();

    const submitButton = contactPage.form.getSubmitButton();

    submitButton.should("be.disabled");
  });

  it("should enable the submit button when the form is filled out", () => {
    contactPage.visit();

    contactPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = contactPage.form.getSubmitButton();
    submitButton.should("not.be.disabled");
  });

  it("should post the email on form submit", () => {
    contactPage.form.interceptAndStubFormSubmission(204);

    contactPage.visit();

    contactPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = contactPage.form.getSubmitButton();
    submitButton.click();

    contactPage.form.getFormSubmission().then(({ request }) => {
      const { name, email, message, recaptchaToken } = request.body;

      expect(name).to.equal("My Name");
      expect(email).to.equal("my.name@test.com");
      expect(message).to.equal("Hello, this is a test message");
      expect(recaptchaToken).to.exist;
    });
  });

  it("should show a success message on successful form submission", () => {
    contactPage.form.interceptAndAddCypressHeader(204);

    contactPage.visit();

    contactPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = contactPage.form.getSubmitButton();
    submitButton.click();

    contactPage.form.getFormSubmission().then(() => {
      const successMessage = contactPage.form.getFormResultMessage();

      successMessage.should("exist").and("contain.text", "Message sent successfully!");
    });
  });

  it("should show an error message on failed form submission", () => {
    contactPage.form.interceptAndAddCypressHeader(500);

    contactPage.visit();

    contactPage.form.fillOutForm({
      name: "My Name",
      email: "my.name@test.com",
      message: "Hello, this is a test message"
    });

    const submitButton = contactPage.form.getSubmitButton();
    submitButton.click();

    contactPage.form.getFormSubmission().then(() => {
      const errorMessage = contactPage.form.getFormResultMessage();

      errorMessage.should("exist").and("contain.text", "Message failed to send");
    });
  });
});
