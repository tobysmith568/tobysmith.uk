import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Component } from "react";
import { ReCAPTCHAProps } from "react-google-recaptcha";
import Form from "../../../src/components/contact/form";
import { postJSON } from "../../../src/utils/http-request";
import renderWithTheme from "../../test-helpers/render-with-theme";

const mockedRecaptchaReset = jest.fn();
const mockedRecaptchaExecuteAsync = jest.fn();

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

    reset = mockedRecaptchaReset;
    executeAsync = mockedRecaptchaExecuteAsync;
  }
}));

jest.mock("../../../src/utils/http-request");

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

  const mockedPostJSON = jest.mocked(postJSON);

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

      await populateForm(validName, validEmail, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).not.toBeDisabled();
    });

    it("should be disabled when the form is valid except the name is empty", async () => {
      render();

      await populateForm("", validEmail, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email is empty", async () => {
      render();

      await populateForm(validName, "", validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the message is empty", async () => {
      render();

      await populateForm(validName, validEmail, undefined);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email does not contain an @", async () => {
      render();

      const invalidEmail = "this.contains.no.at.symbol";

      await populateForm(validName, invalidEmail, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email does not contain a . after the @", async () => {
      render();

      const invalidEmail = "this.contains.no.dot.after.@symbol";

      await populateForm(validName, invalidEmail, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email contains nothing before the @", async () => {
      render();

      const invalidEmail = "@this.contains.nothing.before.at.symbol";

      await populateForm(validName, invalidEmail, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email contains nothing after the .", async () => {
      render();

      const invalidEmail = "this@contains-nothing-after-dot-symbol.";

      await populateForm(validName, invalidEmail, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    it("should be disabled when the form is valid except the email contains nothing between the @ and the .", async () => {
      render();

      const invalidEmail = "this-contains-nothing-between-@.-and-dot";

      await populateForm(validName, invalidEmail, validMessage);

      const button = screen.getByRole("button", { name: "Send Message" });

      expect(button).toBeDisabled();
    });

    whitespaceValues.forEach(whitespace => {
      it(`should be disabled when the form is valid except the email contains a ${whitespace.name} before the @`, async () => {
        render();

        const invalidEmail = `this-contains-a-${whitespace.name}-before-the${whitespace.value}@test.com`;

        await populateForm(validName, invalidEmail, validMessage);

        const button = screen.getByRole("button", { name: "Send Message" });

        expect(button).toBeDisabled();
      });

      it(`should be disabled when the form is valid except the email contains a ${whitespace.name} between the @ and the .`, async () => {
        render();

        const invalidEmail = `this-contains-a-${whitespace.name}-after-the@test-${whitespace.value}-domain.com`;

        await populateForm(validName, invalidEmail, validMessage);

        const button = screen.getByRole("button", { name: "Send Message" });

        expect(button).toBeDisabled();
      });

      it(`should be disabled when the form is valid except the email contains a ${whitespace.name} after the .`, async () => {
        render();

        const invalidEmail = `this@contains-a-${whitespace.name}-after-the.co${whitespace.value}m`;

        await populateForm(validName, invalidEmail, validMessage);

        const button = screen.getByRole("button", { name: "Send Message" });

        expect(button).toBeDisabled();
      });
    });

    describe("onClick", () => {
      it("should disable the name input", async () => {
        mockedRecaptchaExecuteAsync.mockResolvedValue("token");

        render();

        await populateForm(validName, validEmail, validMessage);

        await submitForm();

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeDisabled();
      });

      it("should disable the email input", async () => {
        mockedRecaptchaExecuteAsync.mockResolvedValue("token");

        render();

        await populateForm(validName, validEmail, validMessage);

        await submitForm();

        const nameInput = screen.getByLabelText("Email");
        expect(nameInput).toBeDisabled();
      });

      it("should disable the message input", async () => {
        mockedRecaptchaExecuteAsync.mockResolvedValue("token");

        render();

        await populateForm(validName, validEmail, validMessage);

        await submitForm();

        const nameInput = screen.getByLabelText("Message");
        expect(nameInput).toBeDisabled();
      });

      it("should disable the submit button", async () => {
        mockedRecaptchaExecuteAsync.mockResolvedValue("token");

        render();

        await populateForm(validName, validEmail, validMessage);

        await submitForm();

        const submitButton = screen.getByRole("button", { name: "Send Message" });
        expect(submitButton).toBeDisabled();
      });

      it("should request a recaptcha token from the recaptcha ref", async () => {
        mockedRecaptchaExecuteAsync.mockResolvedValue("token");

        render();

        await populateForm(validName, validEmail, validMessage);

        await submitForm();

        expect(mockedRecaptchaExecuteAsync).toBeCalledTimes(1);
      });

      [null, undefined].forEach(falsy =>
        describe(`if the recaptcha token is falsy (${falsy})`, () => {
          it("should show the try again button", async () => {
            mockedRecaptchaExecuteAsync.mockResolvedValue(falsy);

            render();

            await populateForm(validName, validEmail, validMessage);

            await submitForm();

            await waitFor(() => {
              const tryAgainButton = screen.getByRole("button", { name: "Error. Try Again?" });
              expect(tryAgainButton).toBeInTheDocument();
            });
          });

          it("should not show the submit button", async () => {
            mockedRecaptchaExecuteAsync.mockResolvedValue(falsy);

            render();

            await populateForm(validName, validEmail, validMessage);

            await submitForm();

            await waitFor(() => {
              const submitButton = screen.queryByRole("button", { name: "Send Message" });
              expect(submitButton).toBe(null);
            });
          });

          describe("the try again button", () => {
            it("should enable the name input", async () => {
              mockedRecaptchaExecuteAsync.mockResolvedValue(falsy);

              render();

              await populateForm(validName, validEmail, validMessage);

              await submitForm();

              await waitFor(async () => {
                const tryAgainButton = screen.getByRole("button", { name: "Error. Try Again?" });
                await userEvent.click(tryAgainButton);

                const nameInput = screen.getByLabelText("Name");
                expect(nameInput).not.toBeDisabled();
              });
            });

            it("should enable the email input", async () => {
              mockedRecaptchaExecuteAsync.mockResolvedValue(falsy);

              render();

              await populateForm(validName, validEmail, validMessage);

              await submitForm();

              await waitFor(async () => {
                const tryAgainButton = screen.getByRole("button", { name: "Error. Try Again?" });
                await userEvent.click(tryAgainButton);

                const nameInput = screen.getByLabelText("Email");
                expect(nameInput).not.toBeDisabled();
              });
            });

            it("should enable the message input", async () => {
              mockedRecaptchaExecuteAsync.mockResolvedValue(falsy);

              render();

              await populateForm(validName, validEmail, validMessage);

              await submitForm();

              await waitFor(async () => {
                const tryAgainButton = screen.getByRole("button", { name: "Error. Try Again?" });
                await userEvent.click(tryAgainButton);

                const nameInput = screen.getByLabelText("Message");
                expect(nameInput).not.toBeDisabled();
              });
            });

            it("should re-show the submit button", async () => {
              mockedRecaptchaExecuteAsync.mockResolvedValue(falsy);

              render();

              await populateForm(validName, validEmail, validMessage);

              await submitForm();

              await waitFor(() => {
                const submitButton = screen.getByRole("button", { name: "Send Message" });
                expect(submitButton).toBeInTheDocument();
              });
            });
          });
        })
      );

      describe("if the recaptcha token is not falsy", () => {
        const recaptchaToken = "token";

        beforeEach(() => mockedRecaptchaExecuteAsync.mockResolvedValue(recaptchaToken));

        it("should post to the send email api", async () => {
          render();

          await populateForm(validName, validEmail, validMessage);

          await submitForm();

          expect(mockedPostJSON).toHaveBeenCalledTimes(1);
          expect(mockedPostJSON).toHaveBeenCalledWith("/api/send-email", expect.anything());
        });

        it("should post the name to the send email api", async () => {
          render();

          await populateForm(validName, validEmail, validMessage);

          await submitForm();

          expect(mockedPostJSON).toHaveBeenCalledTimes(1);
          expect(mockedPostJSON).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ name: validName })
          );
        });

        it("should post the email to the send email api", async () => {
          render();

          await populateForm(validName, validEmail, validMessage);

          await submitForm();

          expect(mockedPostJSON).toHaveBeenCalledTimes(1);
          expect(mockedPostJSON).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ email: validEmail })
          );
        });

        it("should post the message to the send email api", async () => {
          render();

          await populateForm(validName, validEmail, validMessage);

          await submitForm();

          expect(mockedPostJSON).toHaveBeenCalledTimes(1);
          expect(mockedPostJSON).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ message: validMessage })
          );
        });

        it("should post the recaptcha token to the send email api", async () => {
          render();

          await populateForm(validName, validEmail, validMessage);

          await submitForm();

          expect(mockedPostJSON).toHaveBeenCalledTimes(1);
          expect(mockedPostJSON).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ recaptchaToken })
          );
        });

        describe("if the post does not throw", () => {
          beforeEach(() => mockedPostJSON.mockResolvedValue(undefined));

          it("should show a 'Sent!' title", async () => {
            render();

            await populateForm(validName, validEmail, validMessage);

            await submitForm();

            await waitFor(() => {
              const sentTitle = screen.queryByRole("heading", { name: "Sent!" });
              expect(sentTitle).toBeTruthy();
            });
          });

          it("should not show the submit button", async () => {
            render();

            await populateForm(validName, validEmail, validMessage);

            await submitForm();

            await waitFor(() => {
              const submitButton = screen.queryByRole("button", { name: "Send Message" });
              expect(submitButton).toBe(null);
            });
          });

          it("should not show the retry button", async () => {
            render();

            await populateForm(validName, validEmail, validMessage);

            await submitForm();

            await waitFor(() => {
              const retryButton = screen.queryByRole("button", {
                name: "Error. Try Again?"
              });
              expect(retryButton).toBe(null);
            });
          });
        });
      });
    });
  });
});

const populateForm = async (validName?: string, validEmail?: string, validMessage?: string) => {
  if (validName) {
    const nameInput = screen.getByLabelText("Name");
    await userEvent.type(nameInput, validName);
  }

  if (validEmail) {
    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, validEmail);
  }

  if (validMessage) {
    const messageInput = screen.getByLabelText("Message");
    await userEvent.type(messageInput, validMessage);
  }
};

const submitForm = async () => {
  const submitButton = screen.getByRole("button", { name: "Send Message" });
  await userEvent.click(submitButton);
};
