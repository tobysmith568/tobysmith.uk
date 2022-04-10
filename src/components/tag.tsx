import styled from "@emotion/styled";
import Image from "next/image";
import { FC, useMemo } from "react";

interface Props {
  label: string;
  url: string;
  iconUrl?: string;
}

const Tag: FC<Props> = ({ label, url, iconUrl }) => {
  const isExternal = useMemo(() => url.startsWith("http") || url.startsWith("mailto"), [url]);

  const rel = useMemo(() => (isExternal ? "noopener noreferrer" : undefined), [isExternal]);
  const target = useMemo(() => (isExternal ? "_blank" : undefined), [isExternal]);

  return (
    <Anchor rel={rel} target={target} href={url}>
      {iconUrl && <Icon src={iconUrl} alt="" width={21} height={21} />}
      <Label>{label}</Label>
    </Anchor>
  );
};
export default Tag;

const Anchor = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.3em 0.6em 0.3em 0.3em;
  border: ${({ theme }) => theme.colours.blue} 1px solid;
  border-radius: 2em;
  border-radius: 8px;
  transition: 0.2s;
  font-size: 0.8em;
  text-decoration: none;
  color: black;
  background-color: #edf7ff;
  margin-right: 0.75em;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.blue};
    color: ${({ theme }) => theme.colours.white};

    img {
      transition: 0.2s;
      // https://codepen.io/sosuke/pen/Pjoqqp
      filter: invert(99%) sepia(0%) saturate(1278%) hue-rotate(107deg) brightness(114%)
        contrast(100%);
    }
  }
`;

const Icon = styled(Image)`
  max-width: 1.5em;
  max-height: 1.5em;
  margin-right: 0.2em;
`;

const Label = styled.span`
  margin-left: 0.3em;
`;
