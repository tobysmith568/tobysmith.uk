import styled from "@emotion/styled";
import NextLink from "next/link";
import { FC, HTMLProps } from "react";

const UnderlineLink: FC<HTMLProps<HTMLAnchorElement>> = props => {
  const { href, ...otherProps } = props;

  return (
    <Link href={href ?? "/"} passHref>
      <a {...otherProps}></a>
    </Link>
  );
};
export default UnderlineLink;

const Link = styled(NextLink)`
  text-decoration: none;
  position: relative;
  color: $black;
  font-weight: bold;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.1em;
    background-color: $black;
    opacity: 0;
    transition: opacity 300ms, transform 300ms;
  }

  &:hover::after,
  &:focus::after {
    opacity: 1;
    transform: translate3d(0, 0.2em, 0);
  }
`;
