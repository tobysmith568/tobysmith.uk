import { Colours } from "@emotion/react";
import styled from "@emotion/styled";
import { FC, useMemo } from "react";

interface Props {
  html: string;
}

const CmsContent: FC<Props> = ({ html }) => {
  const innerHtml = useMemo(() => ({ __html: html }), [html]);

  return <HtmlContent dangerouslySetInnerHTML={innerHtml} colour="black" />;
};
export default CmsContent;

interface HtmlContentProps {
  colour: keyof Colours;
}

const HtmlContent = styled.div<HtmlContentProps>`
  img {
    display: block;
    width: 75%;
    height: auto;
    margin-left: auto;
    margin-right: auto;

    @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
      width: 100%;
    }
  }

  code {
    color: ${({ theme }) => theme.colours.blue};
    background-color: ${({ theme }) => theme.colours.paleBlue};
    padding: 0.2em;
    white-space: pre;
  }

  pre code {
    display: block;
    margin: auto;
    overflow: overlay;
    padding: 0.5em;

    @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
      width: 100%;
    }
  }

  blockquote {
    margin-left: 0em;
    margin-right: 0em;
    padding: 0.4em 1em;
    background: ${({ theme }) => theme.colours.paleBlue};
    border-left: ${({ theme }) => theme.colours.blue} 4px solid;
  }

  ul,
  ol {
    li {
      margin-bottom: 0.5em;
    }
  }

  a {
    ${({ theme }) => theme.underlineAnchor("black")};
  }
`;
