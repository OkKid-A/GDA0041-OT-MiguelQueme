interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      status?: number;
    };
  };
}

export default ApiError;
