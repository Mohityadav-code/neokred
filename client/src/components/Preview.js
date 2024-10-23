// client/src/components/Preview.js
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Ensure consistency with backend

const Preview = ({ htmlContent }) => {
    const previewRef = useRef(null);

    useEffect(() => {
      if (previewRef.current) {
        // Highlight code blocks
        hljs.highlightAll();
      }
    }, [htmlContent]);
  
  return (
    <Box
      sx={{
        padding: 2,
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
       dangerouslySetInnerHTML={{ __html: htmlContent }}
    >
        
 
    </Box>
  );
};

export default Preview;
