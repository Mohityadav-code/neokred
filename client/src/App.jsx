// client/src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { Box, AppBar, Toolbar as MuiToolbar, Typography, IconButton, Switch, CssBaseline } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { renderMarkdown } from './markdownRenderer';
import debounce from 'lodash.debounce';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from './components/Footer';

const socket = io('http://localhost:5005');

function App() {
  const [markdown, setMarkdown] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Apply formatting is now handled inside Editor.js, so remove it from App.js

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
      <CssBaseline /> {/* Normalize CSS across browsers */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Editor */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' }, // Responsive width
              borderRight: { md: '1px solid #ddd' },
              height: 'calc(100vh - 64px - 200px)', // Total height minus AppBar (64px) and 200px
              maxHeight: 'calc(100vh - 64px - 200px)',
              overflow: 'auto', // Enable scrolling when content overflows
            }}
          >
            <Editor markdown={markdown} setMarkdown={setMarkdown} />
          </Box>

          {/* Preview */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' }, // Responsive width
              height: 'calc(100vh - 64px - 200px)', // Same height as editor
              maxHeight: 'calc(100vh - 64px - 200px)',
              overflow: 'auto', // Enable scrolling
            }}
          >
            <Preview htmlContent={htmlContent} />
          </Box>
        </Box>

        {/* Optional Footer or Additional Content (200px height) */}
        <Box
          sx={{
            height: '200px',
            backgroundColor: theme.palette.background.paper,
            p: 2,
            overflow: 'auto',
          }}
        >
       
    
  <Footer />
</Box>
        
      </Box>
    </ThemeProvider>
  );
}

export default App;
