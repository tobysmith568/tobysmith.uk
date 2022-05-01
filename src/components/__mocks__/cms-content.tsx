import { FC } from "react";
import { Props } from "../cms-content";

const CmsContent: FC<Props> = ({ type, content }) => (
  <>
    <div data-testid="cms-content-type">{type}</div>
    <div data-testid="cms-content-content">{content}</div>
  </>
);
export default CmsContent;
