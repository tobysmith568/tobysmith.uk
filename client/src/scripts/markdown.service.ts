import { Converter } from "showdown";

export class MarkdownService {

  private static readonly checkedTaskbox = /<li[^>]*><input[^>]*checked[^>]*>/g;
  private static readonly checkedTaskboxResult = "<li class=\"taskbox checked-taskbox\">";

  private static readonly uncheckedTaskbox = /<li[^>]*><input[^>]*>/g;
  private static readonly uncheckedTaskboxResult = "<li class=\"taskbox\">";

  constructor() { }

  public toHTML(markdown: string): string {
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

    return html;
  }
}
