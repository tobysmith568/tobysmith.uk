import styled from "@emotion/styled";
import { FC, useMemo } from "react";

export interface Props {
  type: "html" | "text";
  content: string;
}

const CmsContent: FC<Props> = ({ type, content }) => {
  const innerHtml = useMemo(() => ({ __html: content }), [content]);

  if (type === "html") {
    return <HtmlContent dangerouslySetInnerHTML={innerHtml} />;
  }

  return <HtmlContent>{content}</HtmlContent>;
};
export default CmsContent;

const HtmlContent = styled.div`
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
    ${({ theme }) => theme.underline.hoverTarget()};

    ::after {
      ${({ theme }) => theme.underline.after()};
    }

    &:hover::after,
    &:focus::after {
      ${({ theme }) => theme.underline.afterOnHover()};
    }
  }

  .code code,
  .hljs-punctuation,
  .hljs-attr,
  .hljs-function .hljs-params,
  .hljs-attribute {
    color: #005cc5;
  }

  .hljs-comment {
    color: #008021;
  }

  .hljs-string {
    color: #a31515;
  }

  .hljs-keyword,
  .hljs-function,
  .hljs-selector-pseudo {
    color: #b700db;
  }

  .hljs-title.function_ {
    color: #145182;
  }

  .hljs-variable,
  .hljs-meta,
  .hljs-title.class_ {
    color: #7b1fa2;
  }
`;
