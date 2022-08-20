import { FC } from "react";
import { Props } from "../seo";

const Seo: FC<Props> = ({ title, description, noIndex }) => {
  return (
    <>
      <div data-testid="seo-title">{title}</div>
      <div data-testid="seo-description">{description}</div>
      <div data-testid="seo-noindex">{"" + noIndex}</div>
    </>
  );
};
export default Seo;
