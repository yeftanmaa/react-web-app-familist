import React from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

function SnackbarComponent({ open, handleCLose, message, severity }) {
  return (

    <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleCLose}
    >
        <Alert severity={severity} sx={{width: '100%'}}>
            {message}
        </Alert>
    </Snackbar>
  )
}

export default SnackbarComponent;