import { screen } from "@testing-library/dom";
import RecaptchaTerms from "../../../src/components/contact/recaptcha-terms";
import renderWithTheme from "../../test-helpers/render-with-theme";

describe("recaptcha-terms", () => {
  const render = () => renderWithTheme(<RecaptchaTerms />);

  it("should contain all the text required by the use of Google Recaptcha", () => {
    const requiredText =
      "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.";

    const { container } = render();

    expect(container.textContent).toContain(requiredText);
  });

  describe("privacy policy link", () => {
    it("should link to the Google privacy policy", () => {
      render();

      const privacyPolicyAnchor = screen.getByRole("link", { name: "Privacy Policy" });

      expect(privacyPolicyAnchor).toHaveAttribute("href", "https://policies.google.com/privacy");
    });

    it("should have a rel of 'noopener noreferrer", () => {
      render();

      const privacyPolicyAnchor = screen.getByRole("link", { name: "Privacy Policy" });

      expect(privacyPolicyAnchor).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should open in a new tab", () => {
      render();

      const privacyPolicyAnchor = screen.getByRole("link", { name: "Privacy Policy" });

      expect(privacyPolicyAnchor).toHaveAttribute("target", "_blank");
    });
  });

  describe("terms of service link", () => {
    it("should link to the Google terms of service", () => {
      render();

      const termsOfServiceAnchor = screen.getByRole("link", { name: "Terms of Service" });

      expect(termsOfServiceAnchor).toHaveAttribute("href", "https://policies.google.com/terms");
    });

    it("should have a rel of 'noopener noreferrer", () => {
      render();

      const termsOfServiceAnchor = screen.getByRole("link", { name: "Terms of Service" });

      expect(termsOfServiceAnchor).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should open in a new tab", () => {
      render();

      const termsOfServiceAnchor = screen.getByRole("link", { name: "Terms of Service" });

      expect(termsOfServiceAnchor).toHaveAttribute("target", "_blank");
    });
  });
});
