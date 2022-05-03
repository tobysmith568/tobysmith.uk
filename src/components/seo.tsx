import { NextSeo } from "next-seo";
import { FC, useMemo } from "react";
import { NoIndex } from "../gql/seo";

const defaultPageTitle = "Toby Smith";

export interface Props {
  title?: string;
  description?: string;
  noIndex?: NoIndex;
}

const Seo: FC<Props> = ({ title, description, noIndex }) => {
  const fullTitle = useMemo(() => {
    if (!title || title.length === 0 || title === defaultPageTitle) {
      return defaultPageTitle;
    }

    return `${title} - ${defaultPageTitle}`;
  }, [title]);

  return <NextSeo title={fullTitle} description={description} noindex={noIndex} />;
};
export default Seo;
