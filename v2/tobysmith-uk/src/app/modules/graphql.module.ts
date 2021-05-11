import { InjectionToken, NgModule } from "@angular/core";
import { APOLLO_OPTIONS } from "apollo-angular";
import { InMemoryCache } from "@apollo/client/core";
import { HttpLink } from "apollo-angular/http";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";
import { makeStateKey, TransferState } from "@angular/platform-browser";

const APOLLO_CACHE = new InjectionToken<InMemoryCache>("apollo-cache");
const STATE_KEY = makeStateKey<any>("apollo.state");

@NgModule({
  providers: [
    {
      provide: APOLLO_CACHE,
      useValue: new InMemoryCache()
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink, cache: InMemoryCache, transferState: TransferState, environment: IEnvironment) {
        const isBrowser = transferState.hasKey<any>(STATE_KEY);

        if (isBrowser) {
          const state = transferState.get<any>(STATE_KEY, null);
          cache.restore(state);
        } else {
          transferState.onSerialize(STATE_KEY, () => {
            return cache.extract();
          });
        }

        return {
          link: httpLink.create({ uri: environment.apiUrl }),
          cache
        };
      },
      deps: [HttpLink, APOLLO_CACHE, TransferState, ENVIRONMENT]
    }
  ]
})
export class GraphQLModule {}
