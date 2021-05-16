import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutComponent } from "./about.component";
import { GeneralModule } from "../../general/general.module";
import { PipesModule } from "src/app/pipes/pipes.module";

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, GeneralModule, PipesModule]
})
export class AboutModule {}
