import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useMemo } from "react";

interface Props {
  path: string;
  disableUnderline?: boolean;
}

const NavbarAnchor: FC<PropsWithChildren<Props>> = ({ children, path, disableUnderline }) => {
  const { pathname } = useRouter();

  const isCurrentClassName = useMemo(() => {
    if (disableUnderline || !pathname.startsWith(path)) {
      return "";
    }

    return "current";
  }, [pathname, path, disableUnderline]);

  return (
    <Link href={path} passHref>
      <InnerNavbarAnchor className={isCurrentClassName}>{children}</InnerNavbarAnchor>
    </Link>
  );
};
export default NavbarAnchor;

const InnerNavbarAnchor = styled.a`
  padding: 0em 1em;
  display: grid;
  justify-content: center;
  align-content: center;
  color: ${({ theme }) => theme.colours.white};
  text-decoration: none;

  &::after {
    content: "";
    float: right;
    left: 0;
    width: 100%;
    height: 2px;
    transform: translateY(-100%);
    background-color: ${({ theme }) => theme.colours.white};
    opacity: 0;
    transition: opacity 300ms, transform 300ms;
  }

  &:hover::after,
  &.current::after {
    opacity: 1;
    transform: translate3d(0, 0.1em, 0);
  }
`;
