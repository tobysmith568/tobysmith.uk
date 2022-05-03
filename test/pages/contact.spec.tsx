import { screen, within } from "@testing-library/dom";
import { Props as ExternalContactLinkProps } from "../../src/components/contact/external-contact-link";
import Contact, { getServerSideProps } from "../../src/pages/contact";
import { defaultMockEnv } from "../../src/utils/api-only/__mocks__/env";
import renderWithTheme from "../test-helpers/render-with-theme";

jest.mock("../../src/components/seo");
jest.mock("../../src/utils/api-only/env");

jest.mock("../../src/components/contact/form", () => ({
  __esModule: true,
  default: (props: { clientKey: string }) => <div data-testid="clientKey">{props.clientKey}</div>
}));

jest.mock("../../src/components/contact/external-contact-link", () => ({
  __esModule: true,
  default: (props: ExternalContactLinkProps) => (
    <div data-testid="externalContactLink">
      <div data-testid="name">{props.name}</div>
      <div data-testid="username">{props.username}</div>
      <div data-testid="href">{props.href}</div>
      <div data-testid="img">{props.img}</div>
      <div data-testid="imgAlt">{props.imgAlt}</div>
      <div data-testid="isEmail">{"" + !!props.isEmail}</div>
      <div data-testid="newTab">{"" + !!props.newTab}</div>
    </div>
  )
}));

describe("contact", () => {
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  const render = () =>
    renderWithTheme(
      <Contact clientKey={defaultMockEnv.recaptcha.clientKey} contact={defaultMockEnv.contact} />
    );

  describe("getServerSideProps", () => {
    it("should return the contact env object", async () => {
      const { contact } = defaultMockEnv;

      const result = await getServerSideProps(undefined!);

      expect(result).toHaveProperty("props.contact", contact);
    });

    it("should return the recaptcha client key", async () => {
      const { recaptcha } = defaultMockEnv;

      const result = await getServerSideProps(undefined!);

      expect(result).toHaveProperty("props.clientKey", recaptcha.clientKey);
    });
  });

  describe("Contact Page", () => {
    describe("seo", () => {
      it("should set the seo title", () => {
        render();

        const seoTitle = screen.getByTestId("seo-title");

        expect(seoTitle).toHaveTextContent("Contact Me");
      });

      it("should set the seo description", () => {
        render();

        const seoDescription = screen.getByTestId("seo-description");

        expect(seoDescription).toHaveTextContent(
          "Get in contact with Toby using one of these methods including email, and LinkedIn"
        );
      });

      it("should not set the seo noIndex value ", () => {
        render();

        const seoNoIndex = screen.getByTestId("seo-noindex");

        expect(seoNoIndex).toHaveTextContent("undefined");
      });
    });

    it("should pass the clientKey to the contact form", () => {
      render();

      const clientKey = screen.getByTestId("clientKey");

      expect(clientKey).toHaveTextContent(defaultMockEnv.recaptcha.clientKey);
    });

    it("should have the email contact link first", () => {
      render();

      const emailLink = screen.getAllByTestId("externalContactLink");
      const firstEmailLink = emailLink[0];

      const contactName = within(firstEmailLink).getByTestId("name");
      expect(contactName).toHaveTextContent("Email");

      const contactUsername = within(firstEmailLink).getByTestId("username");
      expect(contactUsername).toHaveTextContent(defaultMockEnv.contact.email);

      const contactHref = within(firstEmailLink).getByTestId("href");
      expect(contactHref).toHaveTextContent(defaultMockEnv.contact.email);

      const contactImg = within(firstEmailLink).getByTestId("img");
      expect(contactImg).toHaveTextContent("/img/email.svg");

      const contactImgAlt = within(firstEmailLink).getByTestId("imgAlt");
      expect(contactImgAlt).toHaveTextContent("Email icon");
    });

    it("should have the GitHub contact link second", () => {
      render();

      const githubLink = screen.getAllByTestId("externalContactLink");
      const secondGithubLink = githubLink[1];

      const contactName = within(secondGithubLink).getByTestId("name");
      expect(contactName).toHaveTextContent("GitHub");

      const contactUsername = within(secondGithubLink).getByTestId("username");
      expect(contactUsername).toHaveTextContent(defaultMockEnv.contact.githubUsername);

      const contactHref = within(secondGithubLink).getByTestId("href");
      expect(contactHref).toHaveTextContent(defaultMockEnv.contact.githubUrl);

      const contactImg = within(secondGithubLink).getByTestId("img");
      expect(contactImg).toHaveTextContent("/img/github.svg");

      const contactImgAlt = within(secondGithubLink).getByTestId("imgAlt");
      expect(contactImgAlt).toHaveTextContent("GitHub icon");
    });

    it("should have the LinkedIn contact link third", () => {
      render();

      const linkedInLink = screen.getAllByTestId("externalContactLink");
      const thirdLinkedInLink = linkedInLink[2];

      const contactName = within(thirdLinkedInLink).getByTestId("name");
      expect(contactName).toHaveTextContent("LinkedIn");

      const contactUsername = within(thirdLinkedInLink).getByTestId("username");
      expect(contactUsername).toHaveTextContent(defaultMockEnv.contact.linkedinUsername);

      const contactHref = within(thirdLinkedInLink).getByTestId("href");
      expect(contactHref).toHaveTextContent(defaultMockEnv.contact.linkedinUrl);

      const contactImg = within(thirdLinkedInLink).getByTestId("img");
      expect(contactImg).toHaveTextContent("/img/linkedin.svg");

      const contactImgAlt = within(thirdLinkedInLink).getByTestId("imgAlt");
      expect(contactImgAlt).toHaveTextContent("LinkedIn icon");
    });

    it("should have the Facebook contact link fourth", () => {
      render();

      const facebookLink = screen.getAllByTestId("externalContactLink");
      const fourthFacebookLink = facebookLink[3];

      const contactName = within(fourthFacebookLink).getByTestId("name");
      expect(contactName).toHaveTextContent("Facebook");

      const contactUsername = within(fourthFacebookLink).getByTestId("username");
      expect(contactUsername).toHaveTextContent(defaultMockEnv.contact.facebookUsername);

      const contactHref = within(fourthFacebookLink).getByTestId("href");
      expect(contactHref).toHaveTextContent(defaultMockEnv.contact.facebookUrl);

      const contactImg = within(fourthFacebookLink).getByTestId("img");
      expect(contactImg).toHaveTextContent("/img/facebook.svg");

      const contactImgAlt = within(fourthFacebookLink).getByTestId("imgAlt");
      expect(contactImgAlt).toHaveTextContent("Facebook icon");
    });

    it("should have isEmail set to true for the email contact link", () => {
      render();

      const emailLink = screen.getAllByTestId("externalContactLink");
      const firstEmailLink = emailLink[0];

      const isEmail = within(firstEmailLink).getByTestId("isEmail");
      expect(isEmail).toHaveTextContent("true");
    });

    it("should have isEmail set to false for the GitHub contact link", () => {
      render();

      const githubLink = screen.getAllByTestId("externalContactLink");
      const secondGithubLink = githubLink[1];

      const isEmail = within(secondGithubLink).getByTestId("isEmail");
      expect(isEmail).toHaveTextContent("false");
    });

    it("should have isEmail set to false for the LinkedIn contact link", () => {
      render();

      const linkedInLink = screen.getAllByTestId("externalContactLink");
      const thirdLinkedInLink = linkedInLink[2];

      const isEmail = within(thirdLinkedInLink).getByTestId("isEmail");
      expect(isEmail).toHaveTextContent("false");
    });

    it("should have isEmail set to false for the Facebook contact link", () => {
      render();

      const facebookLink = screen.getAllByTestId("externalContactLink");
      const fourthFacebookLink = facebookLink[3];

      const isEmail = within(fourthFacebookLink).getByTestId("isEmail");
      expect(isEmail).toHaveTextContent("false");
    });

    it("should have newTab set to false for the email contact link", () => {
      render();

      const emailLink = screen.getAllByTestId("externalContactLink");
      const firstEmailLink = emailLink[0];

      const newTab = within(firstEmailLink).getByTestId("newTab");
      expect(newTab).toHaveTextContent("false");
    });

    it("should have newTab set to true for the GitHub contact link", () => {
      render();

      const githubLink = screen.getAllByTestId("externalContactLink");
      const secondGithubLink = githubLink[1];

      const newTab = within(secondGithubLink).getByTestId("newTab");
      expect(newTab).toHaveTextContent("true");
    });

    it("should have newTab set to true for the LinkedIn contact link", () => {
      render();

      const linkedInLink = screen.getAllByTestId("externalContactLink");
      const thirdLinkedInLink = linkedInLink[2];

      const newTab = within(thirdLinkedInLink).getByTestId("newTab");
      expect(newTab).toHaveTextContent("true");
    });

    it("should have newTab set to true for the Facebook contact link", () => {
      render();

      const facebookLink = screen.getAllByTestId("externalContactLink");
      const fourthFacebookLink = facebookLink[3];

      const newTab = within(fourthFacebookLink).getByTestId("newTab");
      expect(newTab).toHaveTextContent("true");
    });
  });
});
