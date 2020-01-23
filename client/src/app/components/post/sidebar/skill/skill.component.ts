import { Component, OnInit, Input } from "@angular/core";
import { ISkill } from "src/app/models/posts/sidebar/skill";

@Component({
  selector: "app-skill",
  templateUrl: "./skill.component.html",
  styleUrls: ["./skill.component.scss"]
})
export class SkillComponent implements OnInit {

  @Input()
  private skill: ISkill;

  constructor() { }

  ngOnInit() {
  }

  public getURL(): string {
    return this.skill.url;
  }

  public getSearchTerm(): string {
    return this.skill.searchTerm;
  }

}
