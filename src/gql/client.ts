import { GraphQLClient } from "graphql-request";
import { getEnv } from "../env";

const { apiUrl } = getEnv();

export const client = new GraphQLClient(apiUrl, { headers: {} });
export { gql } from "graphql-request";
