
// client/src/components/Editor.js

import React from 'react';
import { Box } from '@mui/material';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/theme/material.css';
import Toolbar from './Toolbar';

 

const Editor = ({ markdown, setMarkdown, applyFormatting }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar applyFormatting={applyFormatting} />
      <ControlledEditor
        value={markdown}
        options={{
          mode: 'markdown',
          theme: 'material',
          lineNumbers: true,
          lineWrapping: true,
          scrollbarStyle: null,
          tabSize: 2,
        }}
        onBeforeChange={(editor, data, value) => {
          setMarkdown(value);
        }}
        onChange={() => {}}
        style={{ flexGrow: 1 }}
      />
    </Box>
  );
};

export default Editor;
