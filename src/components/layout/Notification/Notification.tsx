'use client';

import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from 'react';

import { useBuildJobStore } from '@/store/buildJobStore';

export default function Notification() {
  const queueStatus = useBuildJobStore(state => state.queueStatus);
  const [open, setOpen] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<typeof queueStatus>(null);

  useEffect(() => {
    if (queueStatus) {
      setOpen(true);
      setPreviousStatus(queueStatus);
    } else if (previousStatus?.status === 'success') {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [queueStatus, previousStatus]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' && queueStatus?.status !== 'success') {
      return;
    }
    setOpen(false);
  };

  if (!queueStatus && !previousStatus) return null;

  const displayStatus = queueStatus || previousStatus;
  if (!displayStatus) return null;

  const { componentName, stepName, status } = displayStatus;

  const componentDisplayName = componentName || 'Component';

  // Determine severity (for default icon)
  const getSeverity = () => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'in-progress':
      default:
        return 'info';
    }
  };

  // Get detail message
  const getMessage = () => {
    switch (status) {
      case 'in-progress':
        return `${stepName ? stepName : `Generating ${componentDisplayName}`}`;
      case 'failed':
        return `Failed to generate ${componentDisplayName}`;
      case 'success':
        return `${componentDisplayName} generated`;
      default:
        return undefined;
    }
  };

  // Get action button/indicator
  const getAction = () => {
    switch (status) {
      case 'failed':
        return (
          <IconButton size="small" onClick={handleClose} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        );
      default:
        return undefined;
    }
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={status === 'success' ? 3000 : null}
      sx={{ top: { xs: 70, sm: 70 } }}
    >
      <Alert
        severity={getSeverity()}
        action={getAction()}
        variant="filled"
        sx={{ minWidth: '360px' }}
        iconMapping={{
          info: (
            <CircularProgress enableTrackSlot size={22} thickness={4} sx={{ color: 'inherit' }} />
          ),
        }}
      >
        {getMessage()}
      </Alert>
    </Snackbar>
  );
}
