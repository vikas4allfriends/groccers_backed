'use client'

import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Link,
    Paper,
    Snackbar,
    Alert,
    Divider,
    useTheme,
} from "@mui/material";
import loginTheme from "../../../css/LoginCss";
import { SignUp } from '../../../services/page/Auth';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {renderTextFieldLarge} from '../../../components/TextField';
import {useSelector} from 'react-redux';
import {Set_Notification} from '../../../services/page/common';
import { green } from "@mui/material/colors";

const SignUpPage = () => {
    const theme = useTheme();
    const styles = loginTheme(theme);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const notification = useSelector((store)=> store.Common_Data.notification)
    console.log('notification==', notification)
    const handleCloseNotification = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        Set_Notification({ 
          open: false,
          message:'',
          severity:'' 
        });
      };

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log('handleSignUp exec', values)
        // e.preventDefault();
        setIsSubmitting(true);
        SignUp(values, resetForm)
    };

    const handleCloseSnackbar = (_, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    // validationSchema
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Name is required field'),
        password: Yup.string().required('Password is required field'),
        email:Yup.string().email().required('Email is required field')
    });

    const initialValues = {
        username: '',
        email: '',
        password: "",
        role:"Admin"
    };

    return (

        <Box sx={styles.container}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                sx={styles.paperBox}
            >
                {({ isSubmitting }) => (
                    <Form style={styles.paperBox}>
                        <Paper elevation={1} sx={styles.paperBox}>
                            {/* Left Side - Login Form */}
                            <Box sx={styles.formBox}>
                                <Typography variant="h4" sx={styles.pageTitle}>
                                    Sign Up
                                </Typography>

                                <Typography sx={styles.pageSubtitle}>to access axetyo</Typography>

                                
                                {renderTextFieldLarge(
                                    "username",
                                    "Username"
                                )}
                                <div style={{marginBottom:8}} />
                                {renderTextFieldLarge(
                                    "email",
                                    "Email"
                                )}
                                <div style={{marginBottom:8}} />
                                {renderTextFieldLarge(
                                    "password",
                                    "Password",
                                    "password"
                                )}
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
                                    {isSubmitting ? "Logging in..." : "Sign Up"}
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
                    </Form>
                )}
            </Formik>
            {/* Footer */}
            <Typography sx={styles.footer}>
                © 2024, Eimple Labs Pvt. Ltd. All Rights Reserved.
            </Typography>

            {/* /* Snackbar component */}
            <Snackbar
              open={notification.open}
            //   autoHideDuration={2000}
              onClose={handleCloseNotification}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseNotification}
                severity={notification.severity}
                sx={{
                  width: "100%",
                  ...(notification.severity === "success" && {
                    bgcolor: green[600],
                    "& .MuiAlert-icon": {
                      color: "#fff",
                    },
                  }),
                }}
                variant="filled"
              >
                {notification.message}
              </Alert>
            </Snackbar>
        </Box>
    );
};

export default SignUpPage;
