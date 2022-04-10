import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Seo from "../components/seo";

const phrases = [
  "Full-stack developer",
  "TypeScript fanatic",
  "Burrito over-filler",
  "npm package author"
];

const Home: NextPage = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phrase, setPhrase] = useState("Full-stack developer");

  useEffect(() => {
    setTimeout(() => {
      const nextPhraseIndex = (phraseIndex + 1) % phrases.length;
      setPhraseIndex(nextPhraseIndex);
      setPhrase(phrases[nextPhraseIndex]);
    }, 3000);
  }, [phraseIndex]);

  return (
    <>
      <Seo
        title="Toby Smith"
        description="Toby Smith is a London-based software developer who likes to focus on web-based technologies. This website is a place to see his work and read his thoughts"
      />

      <Main>
        <div>
          <Title>
            Toby Smith<Phrase>{phrase}</Phrase>
          </Title>
          <h2>Blog and Portfolio Website</h2>
        </div>
      </Main>
    </>
  );
};

export default Home;

const Cycle = keyframes`
  0% {
    opacity: 0%;
  }
  15% {
    opacity: 100%;
  }
  80% {
    opacity: 100%;
  }
  95% {
    opacity: 0%;
  }
  100% {
    opacity: 0%;
  }
`;

const Main = styled.main`
  display: grid;
  align-content: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 4em;
  margin-bottom: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.tabletWidth}) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    font-size: 3em;
  }
`;

const Phrase = styled.span`
  font-size: 2rem;
  color: grey;
  margin-left: 1em;
  animation: ${Cycle} 3s infinite;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.tabletWidth}) {
    margin-left: 0;
    &::before {
      display: none;
    }
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    font-size: 1.5rem;
  }

  &::before {
    content: "-";
    margin-right: 1rem;
  }
`;
