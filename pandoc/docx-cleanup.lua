-- Cleanup pass for docx -> Markdown conversions.

-- Grammarly indents code with non-breaking spaces (U+00A0); turn them back
-- into real spaces so the code is copy-pasteable.
local function despace(s)
  return (s:gsub("\194\160", " "))
end

-- 1. Force every code block to render as a backtick-fenced block.
--
-- Pandoc's Markdown/gfm writer emits an *indented* code block whenever the
-- block has no attributes, even with fenced_code_blocks enabled. docx code
-- blocks almost never carry a language, so without this filter they'd all
-- come out indented. We re-emit them as raw fenced blocks instead.
function CodeBlock(el)
  local lang = el.classes[1] or ""
  local text = despace(el.text)

  -- Use a fence long enough to not collide with backticks in the content.
  local longest = 0
  for run in text:gmatch("`+") do
    longest = math.max(longest, #run)
  end
  local fence = string.rep("`", math.max(3, longest + 1))

  return pandoc.RawBlock("markdown", fence .. lang .. "\n" .. text .. "\n" .. fence)
end

-- Same non-breaking-space fix for inline code.
function Code(el)
  el.text = despace(el.text)
  return el
end

-- 2. Strip Word's automatic underline on hyperlink text.
--
-- Word underlines link text by default, which pandoc carries through as an
-- Underline wrapping the whole Link content -> gfm renders it as raw
-- `[<u>...</u>](url)`. Underline applied to ordinary body text is left alone
-- (it's not the direct, sole child of a Link), so deliberate underlining
-- still survives as <u>.
function Link(el)
  if #el.content == 1 and el.content[1].t == "Underline" then
    el.content = el.content[1].content
  end
  return el
end
