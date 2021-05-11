import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectsComponent } from "./projects.component";
import { RouterModule } from "@angular/router";
import { PipesModule } from "src/app/pipes/pipes.module";

@NgModule({
  declarations: [ProjectsComponent],
  imports: [CommonModule, RouterModule, PipesModule]
})
export class ProjectsModule {}
