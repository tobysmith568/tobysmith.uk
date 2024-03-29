import styled from "@emotion/styled";
import Image from "next/image";
import { FC } from "react";

export interface Props {
  newTab?: boolean;
  isEmail?: boolean;
  href: string;
  img: string;
  imgAlt: string;
  name: string;
  username: string;
}

const mailToPrefix = "mailto:";

const ExternalContactLink: FC<Props> = ({ newTab, isEmail, href, img, imgAlt, name, username }) => {
  const target = newTab ? "_blank" : undefined;

  if (isEmail) {
    href = mailToPrefix + href;
  }

  return (
    <Anchor target={target} rel="noopener noreferrer" href={href}>
      <ImageWrapper>
        <Image src={img} alt={imgAlt} layout="fill" />
      </ImageWrapper>

      <Text>
        <Name>{name}</Name>
        <Username>{username}</Username>
      </Text>
    </Anchor>
  );
};
export default ExternalContactLink;

const Anchor = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.contact.externalsBreak2}) {
    &:nth-of-type(even) {
      flex-direction: row-reverse;
    }
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    flex-direction: row !important;
  }

  ${({ theme }) => theme.underline.hoverTarget("black")}

  h3 {
    position: relative;
    color: ${({ theme }) => theme.colours.black};
    width: fit-content;

    &::after {
      ${({ theme }) => theme.underline.after("black")}
    }
  }

  &:hover h3::after,
  &:focus h3::after {
    ${({ theme }) => theme.underline.afterOnHover()}
  }
`;

const ImageWrapper = styled.div`
  height: 3em;
  width: 3em;
  position: inherit;
`;

const Text = styled.div`
  margin-left: 0.5em;
  margin-right: 0.5em;
`;

const Name = styled.h3`
  margin-top: 0em;
  margin-bottom: 0em;
`;

const Username = styled.p`
  margin-top: 0em;
  margin-bottom: 0em;
  font-weight: normal;
  color: ${({ theme }) => theme.colours.blue};
`;
