import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./pages/about/about.component";
import { BlogComponent } from "./pages/blog/blog.component";
import { PostComponent } from "./pages/blog/post/post.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { FourOhFourComponent } from "./pages/four-oh-four/four-oh-four.component";
import { HomeComponent } from "./pages/home/home.component";
import { AllComponent } from "./pages/projects/all/all.component";
import { ProjectComponent } from "./pages/projects/project/project.component";
import { ProjectsComponent } from "./pages/projects/projects.component";

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "about", component: AboutComponent, pathMatch: "prefix" },
  { path: "projects", component: ProjectsComponent, pathMatch: "prefix" },
  { path: "projects/all", component: AllComponent, pathMatch: "prefix" },
  { path: "projects/:slug", component: ProjectComponent, pathMatch: "prefix" },
  { path: "blog", component: BlogComponent, pathMatch: "prefix" },
  { path: "blog/search/:term", component: BlogComponent, pathMatch: "prefix" },
  { path: "blog/:slug", component: PostComponent, pathMatch: "prefix" },
  { path: "contact", component: ContactComponent, pathMatch: "prefix" },
  { path: "**", component: FourOhFourComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabled"
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
