'use client';

import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingOverLay = ({ children }) => {
  const isLoading = useSelector((state) => state.Common_Data.SpinnerStatus);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Ensures overlay is above all other elements
          }}
        >
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      )}
      {children}
    </>
  );
};

export default LoadingOverLay;
