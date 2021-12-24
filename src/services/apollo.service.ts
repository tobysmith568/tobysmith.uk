import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
  TypedDocumentNode
} from "@apollo/client/core";
import { singleton } from "tsyringe";
import { EnvironmentService } from "./environment.service";
import fetch from "cross-fetch";

@singleton()
export class ApolloService {
  private inMemoryCache: InMemoryCache;
  private client: ApolloClient<NormalizedCacheObject>;

  constructor(private readonly environmentService: EnvironmentService) {
    this.inMemoryCache = new InMemoryCache();

    const link = new HttpLink({
      uri: this.environmentService.config.apiUrl,
      fetch
    });

    this.client = new ApolloClient({
      cache: this.inMemoryCache,
      link
    });
  }

  public async query<TResponse, TVariables = OperationVariables>(
    query: TypedDocumentNode<TResponse, TVariables>,
    variables?: TVariables
  ): Promise<TResponse> {
    const response = await this.client.query<TResponse, TVariables>({
      query,
      variables
    });

    return response.data;
  }
}
