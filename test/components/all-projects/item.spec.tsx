import { screen } from "@testing-library/react";
import ItemComponent from "../../../src/components/all-projects/item";
import { Item } from "../../../src/gql/all-projects";
import renderWithTheme from "../../test-helpers/render-with-theme";

describe("item", () => {
  let item: Item;

  beforeEach(() => {
    item = {
      title: "Test title",
      content: {
        text: "Test text"
      },
      owner: "Owner",
      abandoned: false,
      incomplete: false,
      url: "https://example.com"
    };

    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  const render = () => renderWithTheme(<ItemComponent item={item} />);

  describe("link", () => {
    it("should render the item title in the link", () => {
      render();

      const title = screen.getByRole("link", { name: "Test title" });

      expect(title).toBeInTheDocument();
    });

    it("should link to the item url", () => {
      render();

      const title = screen.getByRole("link", { name: "Test title" });

      expect(title).toHaveAttribute("href", item.url);
    });

    it("should open the link in a new tab", () => {
      render();

      const title = screen.getByRole("link", { name: "Test title" });

      expect(title).toHaveAttribute("target", "_blank");
    });
  });

  describe("Owner tag", () => {
    it("should render the owner tag with 'Joint owner' when the item it jointly owned", () => {
      item.owner = "JointOwner";

      render();

      const ownerTag = screen.getByText("Joint owner");

      expect(ownerTag).toBeInTheDocument();
    });

    it("should render the owner tag with 'Contributor' when the item it contributed to", () => {
      item.owner = "Contributor";

      render();

      const ownerTag = screen.getByText("Contributor");

      expect(ownerTag).toBeInTheDocument();
    });

    it("should not render the owner tag when the item is owned by a single person", () => {
      item.owner = "Owner";

      render();

      const ownerTag = screen.queryByText("Owner");

      expect(ownerTag).not.toBeInTheDocument();
    });
  });

  describe("Incomplete tag", () => {
    it("should render the incomplete tag when the item is incomplete", () => {
      item.incomplete = true;

      render();

      const incompleteTag = screen.getByText("Incomplete");

      expect(incompleteTag).toBeInTheDocument();
    });

    it("should not render the incomplete tag when the item is complete", () => {
      item.incomplete = false;

      render();

      const incompleteTag = screen.queryByText("Incomplete");

      expect(incompleteTag).not.toBeInTheDocument();
    });
  });

  describe("Abandoned tag", () => {
    it("should render the abandoned tag when the item is abandoned", () => {
      item.abandoned = true;

      render();

      const abandonedTag = screen.getByText("Abandoned");

      expect(abandonedTag).toBeInTheDocument();
    });

    it("should not render the abandoned tag when the item is not abandoned", () => {
      item.abandoned = false;

      render();

      const abandonedTag = screen.queryByText("Abandoned");

      expect(abandonedTag).not.toBeInTheDocument();
    });
  });

  describe("Content", () => {
    it("should render the item content", () => {
      render();

      const content = screen.getByText("Test text");

      expect(content).toBeInTheDocument();
    });
  });
});
