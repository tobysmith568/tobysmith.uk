import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutModule } from "./about/about.module";
import { BlogModule } from "./blog/blog.module";
import { ContactModule } from "./contact/contact.module";
import { FourOhFourModule } from "./four-oh-four/four-oh-four.module";
import { HomeModule } from "./home/home.module";
import { ProjectsModule } from "./projects/projects.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, HomeModule, AboutModule, ProjectsModule, BlogModule, ContactModule, FourOhFourModule]
})
export class PagesModule {}
