import { NgModule } from "@angular/core";
import { BrowserModule, BrowserTransferStateModule } from "@angular/platform-browser";
import { NgScrollbarModule } from "ngx-scrollbar";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GeneralModule } from "./general/general.module";
import { GraphQLModule } from "../modules/graphql.module";
import { HttpClientModule } from "@angular/common/http";
import { ENVIRONMENT } from "src/environments/environment.interface";
import { environment } from "src/environments/environment";
import { PagesModule } from "./pages/pages.module";
import { RouterModule } from "@angular/router";
import { interceptorProviders } from "../interceptors/interceptor.provider";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    NgScrollbarModule,
    AppRoutingModule,
    GeneralModule,
    PagesModule,
    GraphQLModule,
    HttpClientModule,
    BrowserTransferStateModule,
    RouterModule
  ],
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment
    },
    ...interceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
