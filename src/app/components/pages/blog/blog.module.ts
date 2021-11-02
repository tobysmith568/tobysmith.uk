import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogComponent } from "./blog.component";
import { RouterModule } from "@angular/router";
import { PipesModule } from "src/app/pipes/pipes.module";
import { PostComponent } from "./post/post.component";
import { DisqusModule, DISQUS_SHORTNAME } from "ngx-disqus";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";
import { GeneralModule } from "../../general/general.module";

@NgModule({
  declarations: [BlogComponent, PostComponent],
  imports: [CommonModule, RouterModule, PipesModule, DisqusModule, GeneralModule],
  providers: [
    {
      provide: DISQUS_SHORTNAME,
      deps: [ENVIRONMENT],
      useFactory: (environment: IEnvironment) => environment.disqusShortname
    }
  ]
})
export class BlogModule {}
