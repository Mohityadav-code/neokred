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
      ref={previewRef}
      sx={{
        height: '100%',
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default Preview;
