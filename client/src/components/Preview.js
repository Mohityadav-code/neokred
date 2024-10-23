import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const Preview = ({ htmlContent }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current) {
      hljs.highlightAll();
    }
  }, [htmlContent]);

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        backgroundColor: "background.default",
        color: "text.primary",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          paddingLeft: "10px",
          paddingTop: "9px",
          fontWeight: "bold",
        }}
        fontSize={16}
        gutterBottom
      >
        Preview
      </Typography>
      <Box
        sx={{
          paddingLeft: "10px",
          borderTop: "1px solid #ccc",
        }}
        ref={previewRef}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </Box>
  );
};

export default Preview;
