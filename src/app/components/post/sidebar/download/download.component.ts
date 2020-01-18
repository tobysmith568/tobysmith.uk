import { Component, OnInit, Input } from "@angular/core";
import { IDownload } from "src/app/models/posts/sidebar/download.interface";

@Component({
  selector: "app-download",
  templateUrl: "./download.component.html",
  styleUrls: ["./download.component.scss"]
})
export class DownloadComponent implements OnInit {

  @Input()
  private downloads: IDownload[];

  constructor() { }

  ngOnInit() {
  }

  private getTitle(): string {
    if (this.downloads.length > 1) {
      return "Direct downloads:";
    }

    return "Direct download:";
  }
}
