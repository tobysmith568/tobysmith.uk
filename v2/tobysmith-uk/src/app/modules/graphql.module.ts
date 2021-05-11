import { NgModule } from "@angular/core";
import { APOLLO_OPTIONS } from "apollo-angular";
import { ApolloClientOptions, InMemoryCache } from "@apollo/client/core";
import { HttpLink } from "apollo-angular/http";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";

export function createApollo(httpLink: HttpLink, environment: IEnvironment): ApolloClientOptions<any> {
  const link = httpLink.create({ uri: environment.apiUrl });
  const cache = new InMemoryCache();

  return { link: link as any, cache };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, ENVIRONMENT]
    }
  ]
})
export class GraphQLModule {}
