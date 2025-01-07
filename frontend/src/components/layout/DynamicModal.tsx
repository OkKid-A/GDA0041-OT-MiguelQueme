import React from "react";
import { Box, Fade, Modal, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../../styles/theme.tsx";
import { ReactNode } from "react";

interface DynamicModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  children: ReactNode;
}

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(4),
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
  },
}));

const DynamicModal: React.FC<DynamicModalProps> = ({
  open,
  handleClose,
  title,
  children,
}) => {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
    >
      <Fade in={open}>
        <Box className={classes.modalContent}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ justifySelf: "center" }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: theme.spacing(1),
              marginTop: theme.spacing(2),
            }}
          >
            {children}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DynamicModal;
