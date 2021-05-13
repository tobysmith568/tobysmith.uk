import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { SearchComponent } from "./header/search/search.component";
import { FormsModule } from "@angular/forms";
import { NgProgressModule } from "ngx-progressbar";

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SearchComponent],
  imports: [CommonModule, RouterModule, FormsModule, NgProgressModule],
  exports: [HeaderComponent, FooterComponent]
})
export class GeneralModule {}
