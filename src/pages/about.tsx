import styled from "@emotion/styled";
import { GetServerSideProps, NextPage } from "next";
import CmsContent from "../components/cms-content";
import Seo from "../components/seo";
import Tag from "../components/tag";
import getAboutPage, { AboutPage } from "../gql/about";

type Props = AboutPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const aboutPage = await getAboutPage();

  return {
    props: aboutPage
  };
};

const AboutPage: NextPage<Props> = ({ avatar, topText, mainText, tags, seo }) => {
  return (
    <>
      <Seo {...seo} />

      <main>
        <Intro>
          <Avatar src={avatar.url} draggable="false" alt="Profile picture of Toby" />
          <CmsContent html={topText.html} />
        </Intro>

        <AboutMe>
          <CmsContent html={mainText.html} />

          <Tags>
            {tags.map(tag => (
              <Tag key={tag.name} label={tag.name} url={tag.url} iconUrl={tag.icon?.url} />
            ))}
          </Tags>
        </AboutMe>
      </main>
    </>
  );
};
export default AboutPage;

const Intro = styled.div`
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.tabletWidth}) {
    flex-direction: column;
    align-items: center;
  }
`;

const Avatar = styled.img`
  border-radius: 50%;
  max-width: 15em;
  max-height: 15em;
  margin-right: 2em;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.tabletWidth}) {
    margin-right: 0;
    max-width: 13rem;
  }

  @media only screen and (max-width: ${({ theme }) => theme.sizes.mobileWidth}) {
    max-width: 10rem;
  }
`;

const AboutMe = styled.div`
  margin-top: 2em;
`;

const Tags = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media only screen and (max-width: ${({ theme }) => theme.sizes.tabletWidth}) {
    justify-content: center;
  }
`;
