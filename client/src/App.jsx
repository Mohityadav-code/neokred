// client/src/App.js

import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import {
  Box,
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  IconButton,
  Switch,
  CssBaseline,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import { renderMarkdown } from "./markdownRenderer";
import debounce from "lodash.debounce";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Footer from "./components/Footer";

const socket = io("http://localhost:5005");

function App() {
  const [markdown, setMarkdown] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Debounced function to emit markdown changes
  const emitMarkdown = useCallback(
    debounce((text) => {
      socket.emit("markdown_change", text);
    }, 0),
    []
  );

  // Handle markdown changes
  useEffect(() => {
    emitMarkdown(markdown);
    // Update local storage
    localStorage.setItem("markdown", markdown);
  }, [markdown, emitMarkdown]);

  // Listen for HTML updates from the server
  useEffect(() => {
    socket.on("html_update", (html) => {
      setHtmlContent(html);
    });

    // Handle connection errors
    socket.on("connect_error", () => {
      alert("Connection failed. Please check your network.");
    });

    socket.on("disconnect", () => {
      alert("Disconnected from server.");
    });

    // Cleanup on unmount
    return () => {
      socket.off("html_update");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  // Initial load from local storage
  useEffect(() => {
    const savedMarkdown = localStorage.getItem("markdown") || "";
    setMarkdown(savedMarkdown);
    setHtmlContent(renderMarkdown(savedMarkdown));
  }, []);

  // Theme configuration
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#FFF8F1" : "#FFD3C7",
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <MuiToolbar
          sx={{
            height: "50px",
            backgroundColor: darkMode ? "#333" : "#FFF8F1",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100vw",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontSize: {
                  xs: "1rem",
                  sm: "1.5rem",
                  md: "2rem",
                  lg: "2rem",
                  xl: "2rem",
                },
              }}
            >
              Real-time Markdown Editor
            </Typography>
          </Box>
          <Box>
            <IconButton
              sx={{ ml: 1 }}
              onClick={handleThemeChange}
              color="inherit"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Switch
              checked={darkMode}
              onChange={handleThemeChange}
              color="default"
            />
          </Box>
        </MuiToolbar>

        {/* Editor and Preview */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Responsive flex direction
            flexGrow: 1,
            overflow: "hidden", // Prevent parent from scrolling
          }}
        >
          {/* Editor */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" }, // Full width on mobile, half on desktop
              height: { xs: "50%", md: "auto" }, // Half height on mobile
              borderRight: { md: "1px solid #ddd" }, // Border only on desktop
              borderBottom: { xs: "1px solid #ddd", md: "none" }, // Border bottom on mobile
              boxSizing: "border-box",
              overflow: "auto", // Enable scrolling when content overflows
            }}
          >
            <Editor
              markdownData={markdown}
              setMarkdown={setMarkdown}
              darkMode={darkMode}
            />
          </Box>

          {/* Preview */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" }, // Full width on mobile, half on desktop
              height: { xs: "50%", md: "auto" }, // Half height on mobile
              overflow: "auto", // Enable scrolling
              boxSizing: "border-box",
            }}
          >
            <Preview htmlContent={htmlContent} />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            height: "50px",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
