// client/src/components/Footer.js

import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        p: 2,
        boxShadow: '0 -1px 5px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="body2" color="textSecondary" align="center">
        © 2024 Your Company. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;