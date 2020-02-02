import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./components/pages/home/home.component";
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { DisqusModule } from "ngx-disqus";
import { RecaptchaModule } from "ng-recaptcha";
import { NgxSmartModalModule } from "ngx-smart-modal";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CategoryComponent } from "./components/category/category.component";
import { PostComponent } from "./components/post/post.component";
import { CategoryItemComponent } from "./components/category/category-item/category-item.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { GithubComponent } from "./components/post/sidebar/github/github.component";
import { SkillComponent } from "./components/post/sidebar/skill/skill.component";
import { ItchComponent } from "./components/post/sidebar/itch/itch.component";
import { SidebarComponent } from "./components/post/sidebar/sidebar.component";
import { DownloadComponent } from "./components/post/sidebar/download/download.component";
import { ContentComponent } from "./components/post/content/content.component";
import { ContactComponent } from "./components/pages/contact/contact.component";
import { AboutComponent } from "./components/pages/about/about.component";
import { LinkedinComponent } from "./components/pages/about/linkedin/linkedin.component";
import { GithubComponent as GithubWidgetComponent } from "./components/pages/about/github/github.component";
import { ListComponent } from "./components/list/list.component";
import { ListItemComponent } from "./components/list/list-item/list-item.component";
import { SmallPostComponent } from "./components/pages/home/small-post/small-post.component";
import { IconComponent } from "./components/icon/icon.component";
import { ExternalComponent } from "./components/post/sidebar/external/external.component";
import { NugetComponent } from "./components/post/sidebar/nuget/nuget.component";

const scrollConfig: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },

  { path: "projects", pathMatch: "full", component: CategoryComponent },
  { path: "projects/windows", pathMatch: "full", component: CategoryComponent },
  { path: "projects/websites", pathMatch: "full", component: CategoryComponent },
  { path: "projects/alexa", pathMatch: "full", component: CategoryComponent },
  { path: "university", pathMatch: "full", component: CategoryComponent },
  { path: "university/year1", pathMatch: "full", component: CategoryComponent },
  { path: "university/year2", pathMatch: "full", component: CategoryComponent },
  { path: "university/year2/shooter-unknown-blog", pathMatch: "full", component: CategoryComponent },
  { path: "university/year3", pathMatch: "full", component: CategoryComponent },
  { path: "shooter-unknown-blog", pathMatch: "full", component: CategoryComponent },

  { path: "projects/:slug", pathMatch: "full", component: PostComponent },
  { path: "projects/windows/:slug", pathMatch: "full", component: PostComponent },
  { path: "projects/websites/:slug", pathMatch: "full", component: PostComponent },
  { path: "projects/alexa/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/year1/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/year2/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/year2/shooter-unknown-blog/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/year3/:slug", pathMatch: "full", component: PostComponent },
  { path: "shooter-unknown-blog/:slug", pathMatch: "full", component: PostComponent },

  { path: "about", pathMatch: "full", component: AboutComponent },
  { path: "contact", pathMatch: "full", component: ContactComponent },
  { path: "404", component: NotFoundComponent },

  { path: ":slug", pathMatch: "full", component: PostComponent },

  { path: "**", component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CategoryComponent,
    PostComponent,
    CategoryItemComponent,
    NotFoundComponent,
    GithubComponent,
    SkillComponent,
    ItchComponent,
    SidebarComponent,
    DownloadComponent,
    ContentComponent,
    ContactComponent,
    AboutComponent,
    LinkedinComponent,
    GithubWidgetComponent,
    ListComponent,
    ListItemComponent,
    SmallPostComponent,
    IconComponent,
    ExternalComponent,
    NugetComponent
  ],
  imports: [
    DisqusModule.forRoot("tobysmith"),
    RouterModule.forRoot(routes),
    NgxSmartModalModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    PerfectScrollbarModule,
    HttpClientModule,
    FormsModule,
    RecaptchaModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: scrollConfig
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
