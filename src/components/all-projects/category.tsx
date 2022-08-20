import { FC } from "react";
import { Category } from "../../gql/all-projects";
import Item from "./item";

interface Props {
  category: Category;
}

const Category: FC<Props> = ({ category }) => (
  <div>
    <h2>{category.name}</h2>

    {category.items.map((item, i) => (
      <Item key={i} item={item} />
    ))}
  </div>
);
export default Category;
