// client/src/components/Editor.js

import React, { useRef } from "react";
import { Box } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { githubLight } from "@uiw/codemirror-theme-github"; // Import a light theme

import Toolbar from "./Toolbar";

const Editor = ({ markdownData, setMarkdown, darkMode }) => {
  const editorRef = useRef(null);

  // Determine the CodeMirror theme based on darkMode prop
  const codeMirrorTheme = darkMode ? oneDark : githubLight;

  // Apply formatting from toolbar
  const applyFormatting = (prefix, suffix, sampleText = "") => {
    const editor = editorRef.current;
    if (!editor) return;

    const doc = editor.state.doc;
    const selection = editor.state.selection.main;
    const from = selection.from;
    const to = selection.to;
    const selectedText = doc.sliceString(from, to);

    let insertText = "";
    let newCursorPos = from + prefix.length;

    if (from === to) {
      // No text selected, insert sample text
      insertText = prefix + sampleText + suffix;
      newCursorPos += sampleText.length;
    } else {
      // Text is selected, apply formatting
      insertText = prefix + selectedText + suffix;
      newCursorPos = to + prefix.length + suffix.length;
    }

    editor.dispatch({
      changes: { from, to, insert: insertText },
      selection: { anchor: newCursorPos },
    });

    // Update the markdown state
    setMarkdown(editor.state.doc.toString());
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar applyFormatting={applyFormatting} />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <CodeMirror
          value={markdownData}
          extensions={[markdown()]} // Enable Markdown syntax highlighting
          theme={codeMirrorTheme} // Apply the selected theme
          onCreateEditor={(editor) => {
            editorRef.current = editor;
          }}
          onChange={(value) => {
            setMarkdown(value);
          }}
          height="100%" // Ensures CodeMirror occupies the full height of its container
          style={{
            // Optionally adjust additional styles based on darkMode
            backgroundColor: darkMode ? "#282c34" : "#f5f5f5", // Example light background
            color: darkMode ? "#ffffff" : "#000000", // Ensure text color contrasts with background
          }}
        />
      </Box>
    </Box>
  );
};

export default Editor;
