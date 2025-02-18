'use client'

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Snackbar,
  Alert,
  Divider,
  useTheme,
} from "@mui/material";
import loginTheme from "../../../css/LoginCss";
import {Login} from '../../../services/page/Auth';
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const theme = useTheme();
  const styles = loginTheme(theme);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const token = useSelector((store)=> store.Auth_Data.token)
  console.log('LoginPage token==', token)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('handleLogin exec')
    Login(loginData, pushToDashboard)
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const pushToDashboard =()=>{
    router.push('/MeasuringUnit/dashboard')
  }
  
  return (
    <Box sx={styles.container}>
      <Paper elevation={1} sx={styles.paperBox}>
        {/* Left Side - Login Form */}
        <Box component="form" onSubmit={handleLogin} sx={styles.formBox}>
          <Typography variant="h4" sx={styles.pageTitle}>
            Sign In
          </Typography>

          <Typography sx={styles.pageSubtitle}>to access axetyo</Typography>

          <TextField
            // required
            fullWidth
            label="Username"
            name="username"
            type="text"
            value={loginData.username}
            onChange={handleChange}
            variant="outlined"
            placeholder="Your Username"
            sx={styles.textField}
          />

          <TextField
            // required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Your password..."
            variant="outlined"
            sx={styles.textField}
          />

          <Box sx={styles.linkBox}>
            <Link href="/forgotpassword" sx={styles.link}>
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            sx={styles.button}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </Box>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem sx={styles.divider} />

        {/* Right Side - Logo */}
        <Box sx={styles.logoBox}>
          <Typography variant="h1" sx={styles.logo}>
            axeTyo
          </Typography>
        </Box>
      </Paper>

      {/* Footer */}
      <Typography sx={styles.footer}>
        © 2024, Eimple Labs Pvt. Ltd. All Rights Reserved.
      </Typography>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertMessage === "Login successful!" ? "success" : "error"}
          sx={{
            width: "100%",
            borderRadius: "8px",
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
