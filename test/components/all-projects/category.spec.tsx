import { render, screen } from "@testing-library/react";
import CategoryComponent from "../../../src/components/all-projects/category";
import { Category, Item } from "../../../src/gql/all-projects";

jest.mock("../../../src/components/all-projects/item", () => ({
  __esModule: true,
  default: (props: { item: Item }) => <div data-testid="test-item">{props.item.title}</div>
}));

describe("category", () => {
  let category: Category;

  beforeEach(() => {
    category = {
      name: "Category",
      items: [{ title: "Item 1" }, { title: "Item 2" }] as Item[]
    };

    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  it("should render the category name", () => {
    render(<CategoryComponent category={category} />);

    const title = screen.getByText(category.name);

    expect(title).toBeInTheDocument();
  });

  it("should render each of the items", () => {
    render(<CategoryComponent category={category} />);

    const items = screen.getAllByTestId("test-item");

    screen.debug(items);

    expect(items).toHaveLength(category.items.length);

    items.forEach((item, i) => {
      expect(item).toHaveTextContent(category.items[i].title);
    });
  });
});
