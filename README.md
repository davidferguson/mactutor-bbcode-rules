# BBCode Rules

A set of rules for serializing, deserializing and rendering the bbcodes used for MacTutor.

Used in the slate editor and lektor plugin for MacTutor.

KaTeX is used for math tags to serialize to HTML and render in the editor, and when using in a HTML page or in the editor, you'll need to include the KaTeX CSS to get it to display correctly.

```js
import {
  HTML_RULES,
  BBCODE_RULES,
  BBCODE_TAGS,
  RENDER_BLOCK,
  RENDER_MARK,
  RENDER_INLINE
} from '@mactutor/bbcode-rules'
```
