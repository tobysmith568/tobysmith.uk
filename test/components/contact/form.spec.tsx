import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Component } from "react";
import { ReCAPTCHAProps } from "react-google-recaptcha";
import Form from "../../../src/components/contact/form";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: class FakeRecaptcha extends Component<ReCAPTCHAProps> {
    render() {
      return (
        <>
          <span data-testid="recaptcha-sitekey">{this.props.sitekey}</span>
          <span data-testid="recaptcha-size">{this.props.size}</span>
          <span data-testid="recaptcha-visibility">{this.props.style?.visibility}</span>
        </>
      );
    }
  }
}));

const whitespaceValues = [
  { name: "space", value: " " },
  { name: "tab", value: "\t" },
  { name: "line feed", value: "\n" },
  { name: "carriage return", value: "\r" }
];

describe("form", () => {
  const validName = "John Doe";
  const validEmail = "test@email.com";
  const validMessage = "This is a test message.";

  let clientKey: string;

  beforeEach(() => {
    clientKey = "client-key";

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () => renderWithTheme(<Form clientKey={clientKey} />);

  describe("recaptcha", () => {
    it("should pass the client key to the recaptcha component", () => {
      render();

      const siteKey = screen.getByTestId("recaptcha-sitekey");

      expect(siteKey).toHaveTextContent(clientKey);
    });

    it("should pass the invisible size to the recaptcha component", () => {
      render();

      const size = screen.getByTestId("recaptcha-size");

      expect(size).toHaveTextContent("invisible");
    });

    it("should pass a visibility of 'hidden' to the recaptcha component", () => {
      render();

      const visibility = screen.getByTestId("recaptcha-visibility");

      expect(visibility).toHaveTextContent("hidden");
    });
  });

  describe("form", () => {
    it("should have autoComplete set to off", () => {
      render();

      const form = screen.getByRole("form");

      expect(form).toHaveAttribute("autocomplete", "off");
    });
  });

  describe("name", () => {
    it("should be enabled by default", () => {
      render();

      const nameInput = screen.getByLabelText("Name");

      expect(nameInput).toBeEnabled();
    });

    it("should be empty by default", () => {
      render();

      const messageInput = screen.getByLabelText("Name");

      expect(messageInput).toHaveValue("");
    });
  });

  describe("email", () => {
    it("should be enabled by default", () => {
      render();

      const emailInput = screen.getByLabelText("Email");

      expect(emailInput).toBeEnabled();
    });

    it("should be empty by default", () => {
      render();

      const messageInput = screen.getByLabelText("Email");

      expect(messageInput).toHaveValue("");
    });
  });

  describe("message", () => {
    it("should be enabled by default", () => {
      render();

      const messageInput = screen.getByLabelText("Message");

      expect(messageInput).toBeEnabled();
    });

    it("should be empty by default", () => {
      render();

      const messageInput = screen.getByLabelText("Message");

      expect(messageInput).toHaveValue("");
    });

    it("should have a height of 5 rows", () => {
      render();

      const messageInput = screen.getByLabelText("Message");

      expect(messageInput).toHaveAttribute("rows", "5");
    });
  });

  describe("submit button", () => {
    it("should be disabled by default", () => {
      render();

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be enabled when the form is valid", async () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      await userEvent.type(nameInput, validName);

      const emailInput = screen.getByLabelText("Email");
      await userEvent.type(emailInput, validEmail);

      const messageInput = screen.getByLabelText("Message");
      await userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).not.toBeDisabled();
    });

    it("should be disabled when the form is valid except the name is empty", () => {
      render();

      const emailInput = screen.getByLabelText("Email");
      userEvent.type(emailInput, validEmail);

      const messageInput = screen.getByLabelText("Message");
      userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email is empty", () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      userEvent.type(nameInput, validName);

      const messageInput = screen.getByLabelText("Message");
      userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the message is empty", () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      userEvent.type(nameInput, validName);

      const emailInput = screen.getByLabelText("Email");
      userEvent.type(emailInput, validEmail);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email does not contain an @", () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      userEvent.type(nameInput, validName);

      const emailInput = screen.getByLabelText("Email");
      userEvent.type(emailInput, "this.contains.no.at.symbol");

      const messageInput = screen.getByLabelText("Message");
      userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email does not contain a . after the @", () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      userEvent.type(nameInput, validName);

      const emailInput = screen.getByLabelText("Email");
      userEvent.type(emailInput, "this.contains.no.dot.after.@symbol");

      const messageInput = screen.getByLabelText("Message");
      userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email contains nothing before the @", () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      userEvent.type(nameInput, validName);

      const emailInput = screen.getByLabelText("Email");
      userEvent.type(emailInput, "@this.contains.nothing.before.at.symbol");

      const messageInput = screen.getByLabelText("Message");
      userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email contains nothing after the .", () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      userEvent.type(nameInput, validName);

      const emailInput = screen.getByLabelText("Email");
      userEvent.type(emailInput, "this@contains-nothing-after-dot-symbol.");

      const messageInput = screen.getByLabelText("Message");
      userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email contains nothing between the @ and the .", () => {
      render();

      const nameInput = screen.getByLabelText("Name");
      userEvent.type(nameInput, validName);

      const emailInput = screen.getByLabelText("Email");
      userEvent.type(emailInput, "this-contains-nothing-between-@.-and-dot");

      const messageInput = screen.getByLabelText("Message");
      userEvent.type(messageInput, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    whitespaceValues.forEach(whitespace => {
      it(`should be disabled when the form is valid except the email contains a ${whitespace.name} before the @`, () => {
        render();

        const nameInput = screen.getByLabelText("Name");
        userEvent.type(nameInput, validName);

        const emailInput = screen.getByLabelText("Email");
        userEvent.type(
          emailInput,
          `this-contains-a-${whitespace.name}-before-the${whitespace.value}@test.com`
        );

        const messageInput = screen.getByLabelText("Message");
        userEvent.type(messageInput, validMessage);

        const button = screen.getByRole("button", { name: "Send Message" });

        expect(button).toBeDisabled();
      });

      it(`should be disabled when the form is valid except the email contains a ${whitespace.name} between the @ and the .`, () => {
        render();

        const nameInput = screen.getByLabelText("Name");
        userEvent.type(nameInput, validName);

        const emailInput = screen.getByLabelText("Email");
        userEvent.type(
          emailInput,
          `this-contains-a-${whitespace.name}-after-the@test-${whitespace.value}-domain.com`
        );

        const messageInput = screen.getByLabelText("Message");
        userEvent.type(messageInput, validMessage);

        const button = screen.getByRole("button", { name: "Send Message" });

        expect(button).toBeDisabled();
      });

      it(`should be disabled when the form is valid except the email contains a ${whitespace.name} after the .`, () => {
        render();

        const nameInput = screen.getByLabelText("Name");
        userEvent.type(nameInput, validName);

        const emailInput = screen.getByLabelText("Email");
        userEvent.type(
          emailInput,
          `this@contains-a-${whitespace.name}-after-the.co${whitespace.value}m`
        );

        const messageInput = screen.getByLabelText("Message");
        userEvent.type(messageInput, validMessage);

        const button = screen.getByRole("button", { name: "Send Message" });

        expect(button).toBeDisabled();
      });
    });
  });
});
