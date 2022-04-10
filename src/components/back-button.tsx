import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { FC } from "react";
import UnderlineAnchor from "./underline-anchor";

const BackButton: FC = () => {
  const router = useRouter();

  return (
    <UnderlineAnchor onClick={() => router.back()} colour="black">
      <Arrow>⮜</Arrow>Back
    </UnderlineAnchor>
  );
};
export default BackButton;

const Arrow = styled.span`
  margin-right: 0.3em;
`;
