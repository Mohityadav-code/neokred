
// client/src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { Box, AppBar, Toolbar as MuiToolbar, Typography, IconButton, Switch } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { renderMarkdown } from './markdownRenderer';
import debounce from 'lodash.debounce';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const socket = io('http://localhost:5005');

function App() {
  const [markdown, setMarkdown] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Apply formatting from toolbar
  const applyFormatting = (prefix, suffix) => {
    const textarea = document.querySelector('.CodeMirror textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.slice(start, end);
    const newText = markdown.slice(0, start) + prefix + selectedText + suffix + markdown.slice(end);
    setMarkdown(newText);
  };

  // Debounced function to emit markdown changes
  const emitMarkdown = useCallback(
    debounce((text) => {
      socket.emit('markdown_change', text);
    }, 300),
    []
  );

  // Handle markdown changes
  useEffect(() => {
    emitMarkdown(markdown);
    // Update local storage
    localStorage.setItem('markdown', markdown);
  }, [markdown, emitMarkdown]);

  // Listen for HTML updates from the server
  useEffect(() => {
    socket.on('html_update', (html) => {
      setHtmlContent(html);
    });

    // Handle connection errors
    socket.on('connect_error', () => {
      alert('Connection failed. Please check your network.');
    });

    socket.on('disconnect', () => {
      alert('Disconnected from server.');
    });

    // Cleanup on unmount
    return () => {
      socket.off('html_update');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, []);

  // Initial load from local storage
  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdown') || '';
    setMarkdown(savedMarkdown);
    setHtmlContent(renderMarkdown(savedMarkdown));
  }, []);

  // Theme configuration
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
        },
      }),
    [darkMode]
  );

  // Toggle theme
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static">
          <MuiToolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Real-time Markdown Editor
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={handleThemeChange} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Switch checked={darkMode} onChange={handleThemeChange} color="default" />
          </MuiToolbar>
        </AppBar>

        {/* Editor and Preview */}
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
          {/* Editor */}
          <Box sx={{ width: '50%', borderRight: '1px solid #ddd' }}>
            <Editor markdown={markdown} setMarkdown={setMarkdown} applyFormatting={applyFormatting} />
          </Box>

          {/* Preview */}
          <Box sx={{ width: '50%' }}>
            <Preview htmlContent={htmlContent} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;


