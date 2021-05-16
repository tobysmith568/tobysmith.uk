import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContactComponent } from "./contact.component";
import { FormsModule } from "@angular/forms";
import { RecaptchaModule } from "ng-recaptcha";

@NgModule({
  declarations: [ContactComponent],
  imports: [CommonModule, FormsModule, RecaptchaModule]
})
export class ContactModule {}
