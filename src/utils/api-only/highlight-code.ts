import * as Cheerio from "cheerio";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("bash", bash);

const highlightCode = (html: string): string => {
  const $ = Cheerio.load(html);

  $("pre code").replaceWith(function (): Cheerio.Cheerio<Cheerio.Node> {
    const unformattedCode = $(this).text() ?? "";

    const classes = $(this).parent().parent().attr("class");
    const languageClass = classes?.split(" ").find(value => value !== "code");

    try {
      const formattedCode = format(unformattedCode, languageClass);

      $(this).html(formattedCode);
    } catch {
      $(this).html(unformattedCode);
    }
    return $(this);
  });

  return $.html();
};
export default highlightCode;

const format = (unformattedCode: string, language?: string) => {
  if (!!language) {
    return hljs.highlight(unformattedCode, { language }).value;
  }

  return hljs.highlightAuto(unformattedCode).value;
};
