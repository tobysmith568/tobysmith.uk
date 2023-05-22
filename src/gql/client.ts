import { GraphQLClient } from "graphql-request";
import { getEnv } from "../utils/api-only/env";

const { apiUrl } = getEnv();

export const client = new GraphQLClient(apiUrl, { headers: {} });
export { gql } from "graphql-request";
export type { Variables as VariablesBase } from "graphql-request";
