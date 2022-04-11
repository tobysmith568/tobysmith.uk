import styled from "@emotion/styled";
import Link from "next/link";
import { FC, useMemo } from "react";
import { Post } from "../../gql/blog";
import CmsContent from "../cms-content";
import HorizontalRule from "../horizontal-rule";

interface Props {
  post: Post;
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric"
};

const BlogResult: FC<Props> = ({ post }) => {
  const formattedDate = useMemo(() => {
    const date = new Date(post.date);
    return date.toLocaleDateString(undefined, dateFormatOptions);
  }, [post.date]);

  return (
    <article>
      <Link href={"/blog/" + post.slug} passHref>
        <BlogPost>
          <header>
            <h2>{post.title}</h2>
            <h4>{formattedDate}</h4>
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
  text-decoration: none;
  position: relative;
  color: ${({ theme }) => theme.colours.black};

  h2 {
    position: relative;
    color: ${({ theme }) => theme.colours.black};
    margin-bottom: 0;
    width: fit-content;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${({ theme }) => theme.colours.black};
      opacity: 0;
      transition: opacity 300ms, transform 300ms;
    }
  }

  &:hover h2::after,
  &:focus h2::after {
    opacity: 1;
    transform: translate3d(0, 0.15em, 0);
  }

  h4 {
    margin-top: 0.4em;
  }
`;
