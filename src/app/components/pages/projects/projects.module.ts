import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectsComponent } from "./projects.component";
import { RouterModule } from "@angular/router";
import { PipesModule } from "src/app/pipes/pipes.module";
import { ProjectComponent } from "./project/project.component";
import { GeneralModule } from "../../general/general.module";
import { AllComponent } from "./all/all.component";

@NgModule({
  declarations: [ProjectsComponent, ProjectComponent, AllComponent],
  imports: [CommonModule, RouterModule, PipesModule, GeneralModule]
})
export class ProjectsModule {}