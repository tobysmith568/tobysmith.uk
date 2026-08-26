import { PageMetaObject } from "./meta.po";

export class ContactPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/contact");
  }

  getTitle() {
    return cy.get("h1");
  }

  getContactMessage() {
    return cy.get("p");
  }

  form = new ContactFormPageObject();
}

type FormData = {
  name?: string;
  email?: string;
  message?: string;
};

export class ContactFormPageObject {
  getNameInput() {
    return cy.get("input[name='name']");
  }

  getEmailInput() {
    return cy.get("input[name='email']");
  }

  getMessageInput() {
    return cy.get("textarea[name='message']");
  }

  getSubmitButton() {
    return cy.get("button[type='submit']");
  }

  fillOutForm({ name, email, message }: FormData) {
    if (name) {
      this.getNameInput().type(name);
    }

    if (email) {
      this.getEmailInput().type(email);
    }

    if (message) {
      this.getMessageInput().type(message);
    }
  }

  interceptAndStubFormSubmission(statusCode: number) {
    cy.intercept("POST", "/_actions/contact", req => {
      req.reply({ statusCode });
    }).as("emailSubmission");
  }

  interceptAndStubFormSubmissionWithMessage(statusCode: number, message: string) {
    cy.intercept("POST", "/_actions/contact", req => {
      req.reply({
        statusCode,
        body: {
          type: "AstroActionError",
          code: "INTERNAL_SERVER_ERROR",
          status: statusCode,
          message
        }
      });
    }).as("emailSubmission");
  }

  getFormSubmission() {
    return cy.wait("@emailSubmission");
  }

  getFormResultMessage() {
    return cy.get("#result-message");
  }
}
