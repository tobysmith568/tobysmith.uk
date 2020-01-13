import { Injectable, SecurityContext } from "@angular/core";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { Converter } from "showdown";

@Injectable({
  providedIn: "root"
})
export class MarkdownService {

  private static readonly checkedTaskbox = /<li[^>]*><input[^>]*checked[^>]*>/g;
  private static readonly checkedTaskboxResult = "<li class=\"taskbox checked-taskbox\">";

  private static readonly uncheckedTaskbox = /<li[^>]*><input[^>]*>/g;
  private static readonly uncheckedTaskboxResult = "<li class=\"taskbox\">";

  constructor(private readonly sanitiser: DomSanitizer) { }

  public toSafeHTML(markdown: string): SafeHtml {
    const html = new Converter({
      noHeaderId: true,
      openLinksInNewWindow: true,
      tasklists: true,
      extensions: [
        {
          type: "output",
          filter: (text) => {

            text = text.replace(MarkdownService.checkedTaskbox, MarkdownService.checkedTaskboxResult);
            text = text.replace(MarkdownService.uncheckedTaskbox, MarkdownService.uncheckedTaskboxResult);

            return text;
          }
        }
      ]
    }).makeHtml(markdown);

    return this.sanitiser.sanitize(SecurityContext.HTML, html);
  }
}
