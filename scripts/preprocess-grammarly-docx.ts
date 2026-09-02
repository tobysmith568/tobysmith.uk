// Grammarly's .docx export has no code styling pandoc can read - code is just
// normal paragraphs set in "Courier New", and pandoc discards direct font
// formatting when reading .docx. So before handing the file to pandoc we
// rewrite it: every paragraph that is entirely monospace gets pandoc's
// "Source Code" paragraph style (-> a fenced code block), and monospace runs
// inside prose paragraphs get the "Verbatim Char" character style
// (-> inline code).

import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

const MONO = "Courier New";
const P_STYLE = '<w:pStyle w:val="SourceCode"/>';
const R_STYLE = '<w:rStyle w:val="VerbatimChar"/>';

// A <w:p>...</w:p> (or self-closing) that contains no nested <w:p>. Grammarly's
// export is a flat paragraph list with no tables/text-boxes, so this is safe.
const PARA_RE = /<w:p(?:\s[^>]*)?\/>|<w:p(?:\s[^>]*)?>(?:(?!<w:p[\s/>])[\s\S])*?<\/w:p>/g;
const RUN_RE = /<w:r(?:\s[^>]*)?\/>|<w:r(?:\s[^>]*)?>(?:(?!<w:r[\s/>])[\s\S])*?<\/w:r>/g;

type Kind = "code" | "empty" | "other";

const textRuns = (para: string): string[] =>
  (para.match(RUN_RE) ?? []).filter(run => /<w:t[\s>]/.test(run));

const classify = (para: string): Kind => {
  const runs = textRuns(para);
  if (runs.length === 0) return "empty";
  return runs.every(run => run.includes(MONO)) ? "code" : "other";
};

const addParagraphStyle = (para: string): string => {
  if (para.includes(P_STYLE)) return para;
  if (para.includes("<w:pPr>")) return para.replace("<w:pPr>", `<w:pPr>${P_STYLE}`);
  if (para.includes("<w:pPr/>")) return para.replace("<w:pPr/>", `<w:pPr>${P_STYLE}</w:pPr>`);
  if (/^<w:p(?:\s[^>]*)?\/>$/.test(para)) {
    return `<w:p><w:pPr>${P_STYLE}</w:pPr></w:p>`;
  }
  return para.replace(/^<w:p(?:\s[^>]*)?>/, open => `${open}<w:pPr>${P_STYLE}</w:pPr>`);
};

const tagInlineCode = (para: string): string =>
  para.replace(RUN_RE, run => {
    if (!/<w:t[\s>]/.test(run) || !run.includes(MONO) || run.includes(R_STYLE)) return run;
    if (run.includes("<w:rPr>")) return run.replace("<w:rPr>", `<w:rPr>${R_STYLE}`);
    if (run.includes("<w:rPr/>")) return run.replace("<w:rPr/>", `<w:rPr>${R_STYLE}</w:rPr>`);
    return run.replace(/^<w:r(?:\s[^>]*)?>/, open => `${open}<w:rPr>${R_STYLE}</w:rPr>`);
  });

const ensureStyles = (stylesXml: string): string => {
  const additions: string[] = [];
  if (!stylesXml.includes('w:styleId="SourceCode"')) {
    additions.push(
      '<w:style w:type="paragraph" w:styleId="SourceCode"><w:name w:val="Source Code"/><w:qFormat/></w:style>'
    );
  }
  if (!stylesXml.includes('w:styleId="VerbatimChar"')) {
    additions.push(
      '<w:style w:type="character" w:styleId="VerbatimChar"><w:name w:val="Verbatim Char"/><w:qFormat/></w:style>'
    );
  }
  return additions.length
    ? stylesXml.replace("</w:styles>", `${additions.join("")}</w:styles>`)
    : stylesXml;
};

export const preprocessGrammarlyDocx = (bytes: Uint8Array): Uint8Array => {
  const files = unzipSync(bytes);
  const documentXml = files["word/document.xml"];
  const stylesXml = files["word/styles.xml"];
  if (!documentXml || !stylesXml) return bytes;

  const docXml = strFromU8(documentXml);
  const paragraphs = [...docXml.matchAll(PARA_RE)].map(match => match[0]);
  const kinds = paragraphs.map(classify);

  // A code block owns any blank paragraphs sitting between its lines, so that
  // internal blank lines stay part of one fenced block instead of splitting it.
  const belongsToCodeBlock = kinds.map((kind, i) => {
    if (kind === "code") return true;
    if (kind !== "empty") return false;
    let prev = i - 1;
    while (prev >= 0 && kinds[prev] === "empty") prev--;
    let next = i + 1;
    while (next < kinds.length && kinds[next] === "empty") next++;
    return kinds[prev] === "code" && kinds[next] === "code";
  });

  let i = 0;
  const newDocXml = docXml.replace(PARA_RE, para => {
    const index = i++;
    if (belongsToCodeBlock[index]) return addParagraphStyle(para);
    if (kinds[index] === "other") return tagInlineCode(para);
    return para;
  });

  files["word/document.xml"] = strToU8(newDocXml);
  files["word/styles.xml"] = strToU8(ensureStyles(strFromU8(stylesXml)));
  return zipSync(files);
};
