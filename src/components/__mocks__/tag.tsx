import { FC } from "react";
import { Props } from "../tag";

const Tag: FC<Props> = ({ label, url, iconUrl }) => {
  return (
    <>
      <div data-testid="tag-label">{label}</div>
      <div data-testid="tag-url">{url}</div>
      <div data-testid="tag-iconUrl">{"" + iconUrl}</div>
    </>
  );
};
export default Tag;
