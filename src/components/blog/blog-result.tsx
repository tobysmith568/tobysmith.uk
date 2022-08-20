import styled from "@emotion/styled";
import Link from "next/link";
import { FC } from "react";
import { Post } from "../../gql/blog";
import CmsContent from "../cms-content";
import FormattedDate from "../formatted-date";
import HorizontalRule from "../horizontal-rule";

interface Props {
  post: Post;
}

const BlogResult: FC<Props> = ({ post }) => {
  return (
    <article>
      <Link href={"/blog/" + post.slug} passHref>
        <BlogPost>
          <header>
            <h2>{post.title}</h2>
            <h4>
              <FormattedDate dateValue={post.date} />
            </h4>
          </header>

          <CmsContent type="text" content={post.excerpt} />
        </BlogPost>
      </Link>

      <HorizontalRule />
    </article>
  );
};
export default BlogResult;

const BlogPost = styled.a`
  ${({ theme }) => theme.underline.hoverTarget("black")};
  font-weight: normal;

  h2 {
    position: relative;
    margin-bottom: 0;
    width: fit-content;

    &::after {
      ${({ theme }) => theme.underline.after("black")};
    }
  }

  &:hover h2::after,
  &:focus h2::after {
    ${({ theme }) => theme.underline.afterOnHover()};
  }

  h4 {
    margin-top: 0.4em;
  }
`;
