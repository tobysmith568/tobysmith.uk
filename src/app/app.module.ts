import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CategoryComponent } from "./components/category/category.component";
import { PostComponent } from "./components/post/post.component";
import { CategoryItemComponent } from "./components/category-item/category-item.component";

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
  { path: "university/year3", pathMatch: "full", component: CategoryComponent },

  { path: "projects/:slug", pathMatch: "full", component: PostComponent },
  { path: "projects/windows/:slug", pathMatch: "full", component: PostComponent },
  { path: "projects/websites/:slug", pathMatch: "full", component: PostComponent },
  { path: "projects/alexa/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/year1/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/year2/:slug", pathMatch: "full", component: PostComponent },
  { path: "university/year3/:slug", pathMatch: "full", component: PostComponent },


  { path: "about", pathMatch: "full", component: CategoryComponent },
  { path: "contact", pathMatch: "full", component: CategoryComponent },
];



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CategoryComponent,
    PostComponent,
    CategoryItemComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    PerfectScrollbarModule
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
