import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
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
    <div style={{ display: 'flex', borderBottom: '1px solid #ccc', padding: '5px', backgroundColor: '#f5f5f5' }}>
      <Tooltip title="Bold">
        <IconButton onClick={() => applyFormatting('**', '**', 'BOLD_TEXT_HERE')} size="small">
          <FormatBold />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton onClick={() => applyFormatting('_', '_', 'italic here')} size="small">
          <FormatItalic />
        </IconButton>
      </Tooltip>
      <Tooltip title="Strikethrough">
        <IconButton onClick={() => applyFormatting('~~', '~~', 'strikethrough')} size="small">
          <StrikethroughS />
        </IconButton>
      </Tooltip>
      <Tooltip title="Code">
        <IconButton onClick={() => applyFormatting('`', '`', 'code here')} size="small">
          <Code />
        </IconButton>
      </Tooltip>
      <Tooltip title="Link">
        <IconButton onClick={() => applyFormatting('[', '](url)', 'link text')} size="small">
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Unordered List">
        <IconButton onClick={() => applyFormatting('- ', '', 'list item')} size="small">
          <FormatListBulleted />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ordered List">
        <IconButton onClick={() => applyFormatting('1. ', '', 'list item')} size="small">
          <FormatListNumbered />
        </IconButton>
      </Tooltip>
      <Tooltip title="Blockquote">
        <IconButton onClick={() => applyFormatting('> ', '', 'quote')} size="small">
          <FormatQuote />
        </IconButton>
      </Tooltip>
      <Tooltip title="Heading">
        <IconButton onClick={() => applyFormatting('## ', '', 'Heading')} size="small">
          <TitleIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
