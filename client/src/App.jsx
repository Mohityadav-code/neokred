
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Box,
  AppBar,
  Toolbar as MuiToolbar,
  Typography,
  IconButton,
  Switch,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import { renderMarkdown } from "./markdownRenderer";
import debounce from "lodash.debounce";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Footer from "./components/Footer";

const socket = io("https://verbose-fishstick-w4xvpjr4j96h594j-5005.app.github.dev");

function App() {
  const [markdown, setMarkdown] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [renderMode, setRenderMode] = useState("WebSocket");

 
  useEffect(() => {
   
    localStorage.setItem("markdown", markdown);

    if (renderMode === "WebSocket") {
     
      const emitMarkdown = debounce((text) => {
        socket.emit("markdown_change", text);
      }, 0);
      emitMarkdown(markdown);
    } else if (renderMode === "HTTP") {
     
      const renderMarkdownViaHTTP = async () => {
        try {
          const response = await fetch("https://verbose-fishstick-w4xvpjr4j96h594j-5005.app.github.dev/render", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ markdown }),
          });
          const data = await response.json();
          setHtmlContent(data.html);
        } catch (error) {
          console.error("Error rendering markdown via HTTP:", error);
        }
      };
      renderMarkdownViaHTTP();
    } else if (renderMode === "Client") {
     
      const renderedHTML = renderMarkdown(markdown);
      setHtmlContent(renderedHTML);
    }
  }, [markdown, renderMode]);

 
  useEffect(() => {
    const handleHtmlUpdate = (html) => {
      if (renderMode === "WebSocket") {
        setHtmlContent(html);
      }
    };

    socket.on("html_update", handleHtmlUpdate);

   
    socket.on("connect_error", () => {
      if (renderMode === "WebSocket") {
        alert("Connection failed. Please check your network.");
      }
    });

    socket.on("disconnect", () => {
      if (renderMode === "WebSocket") {
        alert("Disconnected from server.");
      }
    });

   
    return () => {
      socket.off("html_update", handleHtmlUpdate);
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [renderMode]);

 
  useEffect(() => {
    const savedMarkdown = localStorage.getItem("markdown") || "";
    setMarkdown(savedMarkdown);
   
    if (renderMode === "Client") {
      const renderedHTML = renderMarkdown(savedMarkdown);
      setHtmlContent(renderedHTML);
    } else if (renderMode === "HTTP") {
     
      const renderMarkdownViaHTTP = async () => {
        try {
          const response = await fetch("https://verbose-fishstick-w4xvpjr4j96h594j-5005.app.github.dev/render", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ markdown: savedMarkdown }),
          });
          const data = await response.json();
          setHtmlContent(data.html);
        } catch (error) {
          console.error("Error rendering markdown via HTTP:", error);
        }
      };
      renderMarkdownViaHTTP();
    }
   
  }, [renderMode]);

 
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

 
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />  
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Render Mode Dropdown */}
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="render-mode-label" sx={{
                color: darkMode ? "#FFF8F1" : "#333",
              }}>Render Mode</InputLabel>
              <Select
                labelId="render-mode-label"
                id="render-mode-select"
                value={renderMode}
                onChange={(e) => setRenderMode(e.target.value)}
                label="Render Mode"
              >
                <MenuItem value={"WebSocket"}>WebSocket Rendering</MenuItem>
                <MenuItem value={"HTTP"}>HTTP Request Rendering</MenuItem>
                <MenuItem value={"Client"}>Client-side Rendering</MenuItem>
              </Select>
            </FormControl>
            {/* Theme Toggle */}
            <IconButton
              sx={{ ml: 1 }}
              onClick={handleThemeChange}
              color="inherit"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
           
          </Box>
        </MuiToolbar>

        {/* Editor and Preview */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexGrow: 1,
            overflow: "hidden",
          }}
        >
          {/* Editor */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              height: { xs: "50%", md: "auto" },
              borderRight: { md: "1px solid #ddd" },
              borderBottom: { xs: "1px solid #ddd", md: "none" },
              boxSizing: "border-box",
              overflow: "auto",
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
              width: { xs: "100%", md: "50%" },
              height: { xs: "50%", md: "auto" },
              overflow: "auto",
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
