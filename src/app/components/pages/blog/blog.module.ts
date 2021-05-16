import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogComponent } from "./blog.component";
import { RouterModule } from "@angular/router";
import { PipesModule } from "src/app/pipes/pipes.module";
import { PostComponent } from "./post/post.component";

@NgModule({
  declarations: [BlogComponent, PostComponent],
  imports: [CommonModule, RouterModule, PipesModule]
})
export class BlogModule {}
