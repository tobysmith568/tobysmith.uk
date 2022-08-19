describe("Contact page", () => {
  describe("Contact form", () => {
    const recipientEmail = Cypress.env("contactEmail");

    const name = "Someone's Name";
    const email = "someone@tobysmith.uk";
    const message = "This is the message";

    beforeEach(() => {
      cy.task("deleteLastEmail");
    });

    it("Sends emails when the form data is valid", () => {
      cy.visit("/contact");

      fillFormAndSubmit(name, email, message);

      cy.get(`div:contains("Sent!")`).should("exist").should("be.visible");

      cy.task<string>("getLastEmail").should("be.an", "object");
    });

    it("Sends emails to the correct email", () => {
      cy.visit("/contact");

      fillFormAndSubmit(name, email, message);

      cy.get(`div:contains("Sent!")`).should("exist").should("be.visible");

      cy.task<string>("getLastEmail")
        .should("be.an", "object")
        .its("headers.to")
        .should("equal", recipientEmail);
    });

    it("Sends emails with the correct subject line", () => {
      cy.visit("/contact");

      fillFormAndSubmit(name, email, message);

      cy.get(`div:contains("Sent!")`).should("exist").should("be.visible");

      cy.task<string>("getLastEmail")
        .should("be.an", "object")
        .its("headers.subject")
        .should("equal", `New message from ${name} via tobysmith.uk`);
    });

    it("Sends emails with the correct content", () => {
      cy.visit("/contact");

      fillFormAndSubmit(name, email, message);

      cy.get(`div:contains("Sent!")`).should("exist").should("be.visible");

      cy.task<string>("getLastEmail")
        .its("body")
        .should("equal", `The following message is from ${name}, ${email}\n\n${message}`);
    });

    it("Does not show the sent! message when the server returns a 400", () => {
      cy.intercept({ method: "POST", url: "/api/send-email" }, { statusCode: 400 }).as(
        "getRecaptchaToken"
      );

      cy.visit("/contact");

      fillFormAndSubmit(name, email, message);

      cy.get(`div:contains("Sent!")`).should("not.exist");
    });

    it("Shows the try again button when the server returns a 400", () => {
      cy.intercept({ method: "POST", url: "/api/send-email" }, { statusCode: 400 }).as(
        "getRecaptchaToken"
      );

      cy.visit("/contact");

      fillFormAndSubmit(name, email, message);

      cy.get(`div:contains("Sent!")`).should("not.exist");
      cy.get(`input[value="Error. Try Again?"]`).should("exist").should("be.visible");
    });

    it("Shows the Send button when the try again button is clicked", () => {
      cy.intercept({ method: "POST", url: "/api/send-email" }, { statusCode: 400 }).as(
        "getRecaptchaToken"
      );

      cy.visit("/contact");

      fillFormAndSubmit(name, email, message);

      cy.get(`input[value="Error. Try Again?"]`).should("exist").click();

      cy.get(`input[value="Send Message"]`).should("exist").should("be.visible");
    });

    const fillFormAndSubmit = (name: string, email: string, message: string) => {
      cy.get("#name").type(name);

      cy.get("#email").type(email);

      cy.get("#message").type(message);

      cy.get(`input[value="Send Message"]`).click();
    };
  });

  describe("contact links", () => {
    it("should link to my email", () => {
      cy.visit("/contact");

      cy.get('h3:contains("Email")')
        .should("exist")
        .closest("a")
        .should("exist")
        .invoke("attr", "href")
        .should("include", "tobysmith568")
        .and("match", /^mailto:/);
    });

    it("should link to my GitHub profile", () => {
      cy.visit("/contact");

      cy.get('h3:contains("GitHub")')
        .should("exist")
        .closest("a")
        .should("exist")
        .invoke("attr", "href")
        .should("include", "tobysmith568")
        .then(href => {
          cy.origin("github.com", { args: { href } }, ({ href }) => {
            cy.visit(href as string);
          });
        });
    });

    it("should link to my Linkedin profile", () => {
      cy.visit("/contact");

      cy.get('h3:contains("LinkedIn")')
        .should("exist")
        .closest("a")
        .should("exist")
        .invoke("attr", "href")
        .should("include", "tobysmith568");

      // Cannot check that page exits because of the LinkedIn auth-wall always returning a 999 status code
    });

    it("should link to my Facebook profile", () => {
      cy.visit("/contact");

      cy.get('h3:contains("Facebook")')
        .should("exist")
        .closest("a")
        .should("exist")
        .invoke("attr", "href")
        .should("include", "tobysmith.uk")
        .then(href => {
          cy.origin("messenger.com", { args: { href } }, ({ href }) => {
            cy.visit(href as string);
          });
        });
    });
  });
});

export {};
