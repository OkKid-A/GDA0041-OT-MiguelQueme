// hooks/useFeedback.ts
import { useState, useCallback } from "react";

interface UseFeedbackResult {
  error: string | null;
  setError: (error: string | null) => void;
  message: string | null;
  setMessage: (message: string | null) => void;
  openModal: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  handleOnClose: () => void;
}
export const useFeedback = (): UseFeedbackResult => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenModal(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleOnClose = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);
  return {
    error,
    setError,
    message,
    setMessage,
    openModal,
    handleOpen,
    handleClose,
    handleOnClose,
  };
};

export default useFeedback;
