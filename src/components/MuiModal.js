import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  submit: {

    margin: theme.spacing(3),
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
    >
      <DialogContent>{children}</DialogContent>
      <DialogActions>
          <Button onClick={startExitAnimation} color="primary" className={classes.submit}>
              Close
          </Button>
      </DialogActions>
    </Dialog>
  );
}

MuiModal.propTypes = {
  ...Dialog.propTypes
};

export default MuiModal;
