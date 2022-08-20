import { GraphQLClient } from "graphql-request";
// eslint-disable-next-line jest/no-mocks-import
import { defaultMockEnv } from "../../src/utils/api-only/__mocks__/env";

jest.mock("graphql-request");
jest.mock("../../src/utils/api-only/env");

describe("gql client", () => {
  const mockedGraphQLClient = jest.mocked(GraphQLClient);

  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  it("should pass the apiUrl to the graphql client", () => {
    jest.isolateModules(() => {
      require("../../src/gql/client");
    });

    expect(mockedGraphQLClient).toHaveBeenCalledWith(defaultMockEnv.apiUrl, expect.anything());
  });

  it("should pass no headers to the graphql client", () => {
    jest.isolateModules(() => {
      require("../../src/gql/client");
    });

    expect(mockedGraphQLClient).toHaveBeenCalledWith(expect.anything(), { headers: {} });
  });
});
