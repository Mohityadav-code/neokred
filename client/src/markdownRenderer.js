// client/src/markdownRenderer.js

import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Choose your preferred theme

// Configure marked to use highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  },
  breaks: true, // Enable line breaks
});

export const renderMarkdown = (markdownText) => {
  return marked(markdownText);
};
