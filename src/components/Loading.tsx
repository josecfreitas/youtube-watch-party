import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

export function Loading() {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="1rem"
    >
      <CircularProgress />
      <Typography variant="body2" component="p">
        Loading Watch Room
      </Typography>
    </Box>
  );
}
