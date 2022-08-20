import { screen } from "@testing-library/react";
import getAboutPage, { AboutPage as AboutPageType } from "../../src/gql/about";
import Seo, { noIndexValues } from "../../src/gql/seo";
import AboutPage, { getServerSideProps } from "../../src/pages/about";
import renderWithTheme from "../test-helpers/render-with-theme";

jest.mock("../../src/components/seo");
jest.mock("../../src/components/tag");
jest.mock("../../src/components/cms-content");

jest.mock("../../src/gql/about", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("about", () => {
  const mockedGetAboutPage = jest.mocked(getAboutPage);

  let avatar: { url: string };
  let topText: { html: string };
  let mainText: { html: string };
  let tags: {
    name: string;
    url: string;
    icon?: {
      url: string;
    };
  }[];
  let seo: Seo;

  beforeEach(() => {
    avatar = { url: "avatar" };
    topText = { html: "topText" };
    mainText = { html: "mainText" };
    tags = [
      { name: "tag1", url: "tag1" },
      { name: "tag2", url: "tag2" }
    ];
    seo = {
      title: "title",
      description: "description",
      noIndex: false
    };

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  const render = () =>
    renderWithTheme(
      <AboutPage avatar={avatar} topText={topText} mainText={mainText} tags={tags} seo={seo} />
    );

  describe("getServerSideProps", () => {
    it("should return the result of getAboutPage", async () => {
      mockedGetAboutPage.mockResolvedValue({
        mainText
      } as AboutPageType);

      const result = await getServerSideProps(undefined!);

      expect(mockedGetAboutPage).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ props: { mainText } });
    });
  });

  describe("About page", () => {
    describe("seo", () => {
      it("should pass the seo title to the seo element", () => {
        render();

        const seoTitle = screen.getByTestId("seo-title");

        expect(seoTitle).toHaveTextContent(seo.title!);
      });

      it("should pass the seo description to the seo element", () => {
        render();

        const seoDescription = screen.getByTestId("seo-description");

        expect(seoDescription).toHaveTextContent(seo.description!);
      });

      noIndexValues.forEach(noIndex =>
        it(`should pass the seo noIndex value '${noIndex}' to the seo element`, () => {
          seo.noIndex = noIndex;

          render();

          const seoNoIndex = screen.getByTestId("seo-noindex");

          expect(seoNoIndex).toHaveTextContent("" + noIndex);
        })
      );
    });

    describe("Avatar", () => {
      it("should pass the avatar url to the avatar", () => {
        render();

        const avatarElement = screen.getByRole("img", { name: "Profile picture of Toby" });

        expect(avatarElement).toHaveAttribute("src", avatar.url);
      });

      it("should have draggable set to false", () => {
        render();

        const avatarElement = screen.getByRole("img", { name: "Profile picture of Toby" });

        expect(avatarElement).toHaveAttribute("draggable", "false");
      });
    });

    describe("cms content", () => {
      it("should pass both the topText and the mainText to the cms content", () => {
        render();

        const cmsContentContents = screen.getAllByTestId("cms-content-content");

        expect(cmsContentContents).toHaveLength(2);
        expect(cmsContentContents[0]).toHaveTextContent(topText.html);
        expect(cmsContentContents[1]).toHaveTextContent(mainText.html);
      });

      it("should pass the type html to the cms content", () => {
        render();

        const cmsContentTypes = screen.getAllByTestId("cms-content-type");

        expect(cmsContentTypes).toHaveLength(2);
        expect(cmsContentTypes[0]).toHaveTextContent("html");
        expect(cmsContentTypes[1]).toHaveTextContent("html");
      });
    });

    describe("tags", () => {
      it("should render all of the tags with the correct labels", () => {
        render();

        const tagLabels = screen.getAllByTestId("tag-label");

        expect(tagLabels).toHaveLength(2);
        expect(tagLabels[0]).toHaveTextContent(tags[0].name);
        expect(tagLabels[1]).toHaveTextContent(tags[1].name);
      });

      it("should render all of the tags with the correct urls", () => {
        render();

        const tagUrls = screen.getAllByTestId("tag-url");

        expect(tagUrls).toHaveLength(2);
        expect(tagUrls[0]).toHaveTextContent(tags[0].url);
        expect(tagUrls[1]).toHaveTextContent(tags[1].url);
      });

      it("should render all of the tags with the correct icon urls", () => {
        render();

        const tagIconUrls = screen.getAllByTestId("tag-iconUrl");

        expect(tagIconUrls).toHaveLength(2);
        expect(tagIconUrls[0]).toHaveTextContent("" + tags[0].icon?.url);
        expect(tagIconUrls[1]).toHaveTextContent("" + tags[1].icon?.url);
      });

      it("should render a tag with an undefined iconUrl if the tag icon data is undefined", () => {
        const tag = tags[0];
        tag.icon = undefined;
        tags = [tag];

        render();

        const tagIconUrls = screen.getAllByTestId("tag-iconUrl");

        expect(tagIconUrls).toHaveLength(1);
        expect(tagIconUrls[0]).toHaveTextContent("undefined");
      });
    });
  });
});
