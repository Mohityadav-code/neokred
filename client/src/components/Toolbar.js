// client/src/components/Toolbar.js

import React from 'react';
import { Tooltip, IconButton, Box } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  Code,
  Link as LinkIcon,
  FormatListBulleted,
  FormatListNumbered,
  StrikethroughS,
  FormatQuote,
  Title as TitleIcon,
} from '@mui/icons-material';

const Toolbar = ({ applyFormatting }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid #ccc',
        padding: '5px',
        backgroundColor: 'background.paper',
        flexWrap: 'wrap', // Allow wrapping on small screens
        gap: 1, // Add spacing between buttons
      }}
    >
      <Tooltip title="Bold">
        <IconButton
          onClick={() => applyFormatting('**', '**', 'BOLD_TEXT_HERE')}
          size="small"
          aria-label="bold"
        >
          <FormatBold fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          onClick={() => applyFormatting('_', '_', 'italic here')}
          size="small"
          aria-label="italic"
        >
          <FormatItalic fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Strikethrough">
        <IconButton
          onClick={() => applyFormatting('~~', '~~', 'strikethrough')}
          size="small"
          aria-label="strikethrough"
        >
          <StrikethroughS fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Code">
        <IconButton
          onClick={() => applyFormatting('`', '`', 'code here')}
          size="small"
          aria-label="code"
        >
          <Code fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Link">
        <IconButton
          onClick={() => applyFormatting('[', '](url)', 'link text')}
          size="small"
          aria-label="link"
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Unordered List">
        <IconButton
          onClick={() => applyFormatting('- ', '', 'list item')}
          size="small"
          aria-label="unordered list"
        >
          <FormatListBulleted fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ordered List">
        <IconButton
          onClick={() => applyFormatting('1. ', '', 'list item')}
          size="small"
          aria-label="ordered list"
        >
          <FormatListNumbered fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Blockquote">
        <IconButton
          onClick={() => applyFormatting('> ', '', 'quote')}
          size="small"
          aria-label="blockquote"
        >
          <FormatQuote fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Heading">
        <IconButton
          onClick={() => applyFormatting('## ', '', 'Heading')}
          size="small"
          aria-label="heading"
        >
          <TitleIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {/* Add more buttons as needed */}
    </Box>
  );
};

export default Toolbar;
