import { ApolloLink } from "@apollo/client/core";
import * as Cheerio from "cheerio";

import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("json", json);

export const graphCmsContentLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    if (!response.data) {
      return response;
    }

    for (const key of Object.keys(response.data)) {
      if (!!response.data[key]?.content?.html && typeof response.data[key]?.content.html === "string") {
        const { html } = response.data[key]?.content;
        const $ = Cheerio.load(html);

        $("div.code p code").replaceWith(function (): Cheerio.Cheerio<Cheerio.Node> {
          const unformattedCode = $(this).text() ?? "";

          const classes = $(this).parent().parent().attr("class");
          const languageClass = classes?.split(" ").find(value => value !== "code") ?? "javascript";

          const formattedCode = hljs.highlight(unformattedCode, { language: languageClass }).value;
          $(this).html(formattedCode);
          return $(this);
        });

        response.data[key].content.html = $.html();
      }
    }

    return response;
  });
});
