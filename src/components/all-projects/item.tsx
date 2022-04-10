import styled from "@emotion/styled";
import { FC } from "react";
import { Item } from "../../gql/all-projects";
import CmsContent from "../cms-content";
import UnderlineAnchor from "../underline-anchor";

interface Props {
  item: Item;
}

const Item: FC<Props> = ({ item }) => {
  const { title, content, owner, abandoned, incomplete, url } = item;

  return (
    <Article>
      <header>
        <Title>
          <UnderlineAnchor colour="black" href={url} target="_blank">
            {title}
          </UnderlineAnchor>

          {owner === "JointOwner" && <OwnerTag>Joint owner</OwnerTag>}
          {owner === "Contributor" && <OwnerTag>Contributor</OwnerTag>}

          {incomplete && <IncompleteTag>Incomplete</IncompleteTag>}
          {abandoned && <AbandonedTag>Abandoned</AbandonedTag>}
        </Title>
      </header>

      <CmsContent type="text" content={content.text} />
    </Article>
  );
};
export default Item;

const Article = styled.article`
  margin-left: 3em;
`;

const Title = styled.h3`
  margin-bottom: 0.2em;
`;

const Tag = styled.span`
  font-size: 0.6em;
  margin-left: 0.4em;
  padding: 0.2em 0.4em 0.2em 0.4em;
  border-radius: 1em;
  border-width: 1px;
  border-style: solid;
  user-select: none;
  white-space: nowrap;
`;

const OwnerTag = styled(Tag)`
  color: ${({ theme }) => theme.colours.ownerTag};
  border-color: ${({ theme }) => theme.colours.ownerTagBorder};
`;

const IncompleteTag = styled(Tag)`
  color: ${({ theme }) => theme.colours.incompleteTag};
  border-color: ${({ theme }) => theme.colours.incompleteTagBorder};
`;

const AbandonedTag = styled(Tag)`
  color: ${({ theme }) => theme.colours.abandonedTag};
  border-color: ${({ theme }) => theme.colours.abandonedTagBorder};
`;
