'use client'

import React from "react";

import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Typography,
  Grid,
  CardContent,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  InputAdornment,
  IconButton,
  TextField,
  Box,
  Button,
  Card,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { green } from "@mui/material/colors";
import {useSelector} from 'react-redux';
import AddProductCss from "../../../../css/AddProductCss";
import {Set_Notification} from '../../../../services/page/common';
import {Add_Product_Company} from '../../../../services/page/ProductCompany';
import {renderTextFieldSmall} from '../../../../components/TextField';

// validationSchema
const validationSchema = Yup.object().shape({
  Name: Yup.string().required('Name is required field'),
  Description: Yup.string().optional().nullable()
});

const AddProductCompany = ({ drawerWidth }) => {
  const theme = useTheme();
  const styles = AddProductCss(theme);
  const router = useRouter();

  //all the state and handler functions
  const notification = useSelector((store)=> store.Common_Data.notification)

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

  const handleBackClick = () => {
    router.push("/ProductCompany/Add");
  };

  const handleCancelClick = () => {
    router.push("/ProductCompany/Add");
  };

  const initialValues = {
    Name:'', 
    Description:null,
  };


  const onSubmit = async (values, { setSubmitting, resetForm }) => {
  
      // Log form values before sending
      console.log("Form values being sent: ", values);
      Add_Product_Company(values,resetForm)
  }
  const renderTextField = (
    name,
    label,
    type = "text",
    options = null,
    isPassword = false,
    min = null
  ) => (
    <Field name={name}>
      {({ field, meta, form: { setFieldValue } }) => (
        <TextField
          sx={styles.StyledTextField}
          {...field}
          label={label}
          type={
            isPassword
              ? name === "password"
                ? showPassword
                  ? "text"
                  : "password"
                : showConfirmPassword
                ? "text"
                : "password"
              : type
          }
          size="small"
          fullWidth
          // required
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error}
          select={!!options}
          // InputLabelProps={type === "date" ? { shrink: true } : {}}
          InputLabelProps={{
            style: {
              fontSize: "14px",
              fontFamily: "Poppins",
              fontWeight: "400",
              color: "#3D3D4E",
            }, // Smaller label font size
            shrink: type === "date" ? true : undefined,
          }}
          InputProps={{
            ...(isPassword
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={
                          name === "password"
                            ? handleClickShowPassword
                            : handleClickShowConfirmPassword
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {name === "password" ? (
                          showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )
                        ) : showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : {}),
            ...(type === "number" && min !== null
              ? {
                  inputProps: { min: min },
                }
              : {}),
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (type === "number" && min !== null) {
              if (value === "" || parseInt(value) < min) {
                setFieldValue(name, min.toString());
              } else {
                setFieldValue(name, value);
              }
            } else {
              field.onChange(e);
            }
          }}
        >
          {options &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    </Field>
  );

  return (
    <Box drawerwidth={drawerWidth} sx={styles.mainContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* navConyainer */}
            <Box sx={styles.navContainer}>
              {/* headingBox */}
              <Box sx={styles.headingBox}>
                <Button
                  variant="text"
                  onClick={handleBackClick}
                  sx={styles.backButton}
                >
                  <KeyboardBackspaceIcon />
                </Button>
                {/* topHeading */}
                <Typography sx={styles.topHeading}>Add Product Company</Typography>
              </Box>

              {/* ButtonBox */}
              <Box sx={styles.buttonBox}>
                {/* actionBox */}
                <Button
                  variant="outlined"
                  disabled={isSubmitting}
                  type="submit"
                  sx={styles.actionButton}
                >
                  Save
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancelClick}
                  sx={styles.actionButton}
                >
                  Cancel
                </Button>
              </Box>
            </Box>

            {/* Snackbar component */}
            <Snackbar
              open={notification.open}
              autoHideDuration={2000}
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

            {/* main form content areas */}
            <Grid container spacing={1} sx={styles.mainGrid}>
              <Grid item xs={12} sm={6} sx={styles.subGrid}>
                {/*  form content left side */}
                <Card sx={styles.card}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.title}
                    >
                      Product Category Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextFieldSmall(
                          "Name",
                          "Company Name"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextFieldSmall(
                          "Description",
                          "Description"
                        )}
                      </Grid>
                    </Grid>                                                      
                  </CardContent>
                </Card>
              </Grid>                       
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddProductCompany;
