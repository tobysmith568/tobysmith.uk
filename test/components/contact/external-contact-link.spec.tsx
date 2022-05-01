import { screen } from "@testing-library/dom";
import ExternalContactLink, { Props } from "../../../src/components/contact/external-contact-link";
import renderWithTheme from "../../test-helpers/render-with-theme";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string }) => (
    <>
      <div data-testid="img-src">{props.src}</div>
      <div data-testid="img-alt">{props.alt}</div>
    </>
  )
}));

describe("external-contact-link", () => {
  let props: Props;

  beforeEach(() => {
    props = {
      newTab: false,
      isEmail: false,
      href: "",
      img: "",
      imgAlt: "",
      name: "",
      username: ""
    };
  });

  const render = () => renderWithTheme(<ExternalContactLink {...props} />);

  it("should render the given name in a heading", () => {
    props.name = "Test Name";

    render();

    const title = screen.getByRole("heading", { name: props.name });

    expect(title).toBeInTheDocument();
  });

  it("should render the given username", () => {
    props.username = "Test Username";

    render();

    const title = screen.getByText(props.username);

    expect(title).toBeInTheDocument();
  });

  it("should render the image using the given source", () => {
    props.img = "test-img-src";

    render();

    const imgSrc = screen.getByTestId("img-src");

    expect(imgSrc).toHaveTextContent(props.img);
  });

  it("should render the image using the given alt text", () => {
    props.imgAlt = "test-img-alt";

    render();

    const imgAlt = screen.getByTestId("img-alt");

    expect(imgAlt).toHaveTextContent(props.imgAlt);
  });

  describe("anchor", () => {
    it("should have a target of '_blank' if newTab is true", () => {
      props.newTab = true;

      render();

      const anchor = screen.getByRole("link");

      expect(anchor).toHaveAttribute("target", "_blank");
    });

    it("should have no target if newTab is false", () => {
      props.newTab = false;

      render();

      const anchor = screen.getByRole("link");

      expect(anchor).not.toHaveAttribute("target");
    });

    it("should have a rel of 'noopener noreferrer'", () => {
      render();

      const anchor = screen.getByRole("link");

      expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should prepend the href with the mailto prefix if isEmail is true", () => {
      props.isEmail = true;
      props.href = "test@user.com";

      render();

      const anchor = screen.getByRole("link");

      expect(anchor).toHaveAttribute("href", `mailto:${props.href}`);
    });

    it("should not prepend the href with the mailto prefix if isEmail is false", () => {
      props.isEmail = false;
      props.href = "https://test.url";

      render();

      const anchor = screen.getByRole("link");

      expect(anchor).toHaveAttribute("href", props.href);
    });
  });
});
