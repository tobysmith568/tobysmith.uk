import { NgModule } from "@angular/core";
import { BrowserModule, BrowserTransferStateModule } from "@angular/platform-browser";
import { NgScrollbarModule } from "ngx-scrollbar";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GeneralModule } from "./general/general.module";
import { AboutModule } from "./pages/about/about.module";
import { BlogModule } from "./pages/blog/blog.module";
import { ContactModule } from "./pages/contact/contact.module";
import { FourOhFourModule } from "./pages/four-oh-four/four-oh-four.module";
import { HomeModule } from "./pages/home/home.module";
import { ProjectsModule } from "./pages/projects/projects.module";
import { GraphQLModule } from "../modules/graphql.module";
import { HttpClientModule } from "@angular/common/http";
import { ENVIRONMENT } from "src/environments/environment.interface";
import { environment } from "src/environments/environment";
import { PagesModule } from "./pages/pages.module";

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
    BrowserTransferStateModule
  ],
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
