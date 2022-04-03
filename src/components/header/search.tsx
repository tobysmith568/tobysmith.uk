import styled from "@emotion/styled";
import { FC } from "react";

const Search: FC = () => (
  <SearchBar>
    <SearchInput type="search" placeholder="search" />
  </SearchBar>
);
export default Search;

const SearchBar = styled.div`
  margin-right: 20px;
  height: 100%;
  display: grid;
  justify-content: center;
  align-content: center;

  input::-webkit-search-decoration,
  input::-webkit-search-cancel-button {
    display: none;
  }

  input:-moz-placeholder {
    color: transparent;
  }

  input::-webkit-input-placeholder {
    color: transparent;
  }
`;

const SearchInput = styled.input`
  outline: none;
  box-sizing: content-box;
  font-size: 1em;
  background: transparent url(/assets/img/search.svg) no-repeat 9px center;
  background-clip: padding-box;
  border: none;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.5s;
  width: 20px;
  color: transparent;
  cursor: pointer;

  &:hover {
    background-color: #00000018;
  }

  &:focus,
  &.on-search {
    width: 16em;
    background-color: #00000018;
    padding-left: 40px;
    color: ${({ theme }) => theme.colours.white};
    cursor: auto;
  }
`;
