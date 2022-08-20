import highlightCode from "../../../src/utils/api-only/highlight-code";

const jsCodeSnippet = "function whatever() { /* stuff */ }";
const jsCodeSnippetHighlighted =
  '<span class="hljs-keyword">function</span> <span class="hljs-title function_">whatever</span>(<span class="hljs-params"></span>) { <span class="hljs-comment">/* stuff */</span> }';
const jsCodeSnippetHighlightedAsYaml =
  '<span class="hljs-string">function</span> <span class="hljs-string">whatever()</span> { <span class="hljs-string">/*</span> <span class="hljs-string">stuff</span> <span class="hljs-string">*/</span> }';

describe("highlight code", () => {
  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  it("should not modify html without the <pre><code> pattern", () => {
    const htmlWithoutPreCode = `<div>${jsCodeSnippet}</div>`;

    const result = highlightCode(htmlWithoutPreCode);

    expect(result).toBe(htmlWithoutPreCode);
  });

  it("should modify html with the <pre><code> pattern", () => {
    const htmlWithPreCode = `<div><pre><code>${jsCodeSnippet}</code></pre></div>`;
    const highlightedHtmlWithPreCode = `<div><pre><code>${jsCodeSnippetHighlighted}</code></pre></div>`;

    const result = highlightCode(htmlWithPreCode);
    expect(result).toBe(highlightedHtmlWithPreCode);
  });

  it("should not highlight code when given a language on the parent tag which doesn't match the snippet", () => {
    const languageWhichDoesNotMatch = "xml";

    const htmlWithIncorrectLanguageOnParent = `<div class="${languageWhichDoesNotMatch}"><pre><code>${jsCodeSnippet}</code></pre></div>`;

    const result = highlightCode(htmlWithIncorrectLanguageOnParent);

    expect(result).toBe(htmlWithIncorrectLanguageOnParent);
  });

  it("should highlight code when given a language on the parent tag which matches the snippet", () => {
    const snippetLanguage = "javascript";

    const htmlWithCorrectLanguageOnParent = `<div class="${snippetLanguage}"><pre><code>${jsCodeSnippet}</code></pre></div>`;
    const highlightedHtmlWithCorrectLanguageOnParent = `<div class="${snippetLanguage}"><pre><code>${jsCodeSnippetHighlighted}</code></pre></div>`;

    const result = highlightCode(htmlWithCorrectLanguageOnParent);

    expect(result).toBe(highlightedHtmlWithCorrectLanguageOnParent);
  });

  it("should highlight code differently when given a language on the parent tag which partially matches the snippet", () => {
    const differentLanguageToSnippet = "yaml";

    const htmlWithDifferentLanguageOnParent = `<div class="${differentLanguageToSnippet}"><pre><code>${jsCodeSnippet}</code></pre></div>`;
    const highlightedHtmlWithDifferentLanguageOnParent = `<div class="${differentLanguageToSnippet}"><pre><code>${jsCodeSnippetHighlightedAsYaml}</code></pre></div>`;

    const result = highlightCode(htmlWithDifferentLanguageOnParent);

    expect(result).toBe(highlightedHtmlWithDifferentLanguageOnParent);
  });

  it("should return the code unformatted when given a language which isn't loaded", () => {
    // Mock console errors to prevent them from being printed to the console
    const originalConsoleError = global.console.error;
    global.console.error = jest.fn();

    const notALoadedLanguage = "notALoadedLanguage";

    const htmlWithInvalidLanguageOnParent = `<div class="${notALoadedLanguage}"><pre><code>${jsCodeSnippet}</code></pre></div>`;

    const result = highlightCode(htmlWithInvalidLanguageOnParent);

    expect(result).toBe(htmlWithInvalidLanguageOnParent);

    global.console.error = originalConsoleError;
  });

  it("should console error when given a language which is not loaded", () => {
    const originalConsoleError = global.console.error;
    global.console.error = jest.fn();

    const notALoadedLanguage = "notALoadedLanguage";

    const htmlWithInvalidLanguageOnParent = `<div class="${notALoadedLanguage}"><pre><code>${jsCodeSnippet}</code></pre></div>`;

    highlightCode(htmlWithInvalidLanguageOnParent);

    expect(global.console.error).toHaveBeenCalledWith(
      "Could not find the language 'notALoadedLanguage', did you forget to load/include a language module?"
    );

    global.console.error = originalConsoleError;
  });

  ["xml", "css", "javascript", "typescript", "json", "yaml", "bash"].forEach(language =>
    it(`should accept the language: ${language}`, () => {
      const originalConsoleError = global.console.error;
      global.console.error = jest.fn();

      const snippetWithLanguage = `<div class="${language}"><pre><code>${jsCodeSnippet}</code></pre></div>`;

      highlightCode(snippetWithLanguage);

      expect(global.console.error).not.toHaveBeenCalled();

      global.console.error = originalConsoleError;
    })
  );
});
