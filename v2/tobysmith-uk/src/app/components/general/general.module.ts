import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { SearchComponent } from './header/search/search.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SearchComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent]
})
export class GeneralModule {}
