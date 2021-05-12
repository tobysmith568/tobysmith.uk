import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { SearchComponent } from "./header/search/search.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SearchComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [HeaderComponent, FooterComponent]
})
export class GeneralModule {}
