import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";
import UnderlineAnchor from "./underline-anchor";

const BackButton: FC = () => {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <UnderlineAnchor onClick={onClick} colour="black">
      <Arrow>⮜</Arrow>Back
    </UnderlineAnchor>
  );
};
export default BackButton;

const Arrow = styled.span`
  margin-right: 0.3em;
`;
