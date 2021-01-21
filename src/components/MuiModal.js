import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  content: {
    marginBottom: theme.spacing(10),
  },
}));

function MuiModal({ children, open, onExited, ...rest }) {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (open) {
      setShowModal(true);
    }
  }, [open]);

  function startExitAnimation() {
    setShowModal(false);
  }

  function onExitAnimationEnd() {
    onExited();
  }

  return (
    <Dialog
      {...rest}
      open={showModal}
      onClose={startExitAnimation}
      onExited={onExitAnimationEnd}
      className={classes.dialog}
    >
       <DialogTitle id="id">
         <Box display="flex" alignItems="center" justifyContent="flex-end">
                <Box>
                    <IconButton onClick={startExitAnimation}>
                          <CloseIcon />
                    </IconButton>
                </Box>
          </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>{children}</DialogContent>
    </Dialog>
  );
}

MuiModal.propTypes = {
  ...Dialog.propTypes
};

export default MuiModal;
