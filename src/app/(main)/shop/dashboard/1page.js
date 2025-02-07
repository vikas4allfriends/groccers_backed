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

import axios from "axios";
import AddProductCss from "../../../css/AddProductCss";

// validationSchema
const validationSchema = Yup.object().shape({
  organizationName: Yup.string().required("Organization name is required"),
  organizationId: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  country: Yup.string(),
  postalCode: Yup.string(),
  primaryContactName: Yup.string().required("Primary contact name is required"),
  primaryContactEmail: Yup.string()
    .email("Invalid email address")
    .required("Primary contact email is required"),
  primaryContactPhone: Yup.string()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Invalid phone number format"
    )
    .required("Primary contact phone is required"),
  organisationEmail: Yup.string().email("Invalid email address"),
  organisationPhone: Yup.string().matches(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    "Invalid phone number format"
  ),
  websiteUrl: Yup.string().url("Invalid URL"),
  industryType: Yup.string().required("Industry type is required"),
  comment: Yup.string(),
  subscriptionPlan: Yup.string().required("Subscription plan is required"),
  subscriptionStartDate: Yup.date().required(
    "Subscription start date is required"
  ),
  subscriptionEndDate: Yup.date().required("Subscription end date is required"),
  numberOfBatches: Yup.number()
    .positive("Must be a positive number")
    .required("Number of batches is required"),
  numberOfUsers: Yup.number()
    .positive("Must be a positive number")
    .required("Number of users is required"),
  adminUserName: Yup.string().required("Admin name is required"),
  adminUserPhone: Yup.string()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Invalid phone number format"
    )
    .required("Admin phone is required"),
  adminUserEmail: Yup.string()
    .email("Invalid email address")
    .required("Admin email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),

  // validation for optional fields

  logo: Yup.mixed()
    .test("fileSize", "File is too large", (value) => {
      if (!value) return true; // Skip validation if no file
      return value.size <= 5000000; // 5MB limit
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true; // Skip validation if no file
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
  taxNumber: Yup.string()
    .matches(/^[0-9A-Z-]*$/, "Invalid tax number format")
    .max(20, "Tax number must not exceed 20 characters"),
});

const AddProduct = ({ drawerWidth }) => {
  const theme = useTheme();
  const styles = AddProductCss(theme);
  const router = useRouter();

  //all the state and handler functions
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const handleBackClick = () => {
    router.push("/product/dashboard");
  };

  const handleCancelClick = () => {
    router.push("/product/dashboard");
  };

  const initialValues = {
    organizationName: "",
    organizationId: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    organisationEmail: "",
    organisationPhone: "",
    websiteUrl: "",
    industryType: "",
    comment: "",
    subscriptionPlan: "",
    subscriptionStartDate: "",
    subscriptionEndDate: "",
    numberOfBatches: "",
    numberOfUsers: "",
    adminUserName: "",
    adminUserPhone: "",
    adminUserEmail: "",
    password: "",
    confirmPassword: "",
    logo: "",
    taxNumber: "",
    logo: "",
    taxNumber: "",
  };

  // for file upload
  const handleFileChange = (setFieldValue) => (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue("logo", file);
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);

      // Log form values before sending
      console.log("Form values being sent: ", values);

      // Send data to the backend using POST request
      const response = await axios.post(
        "http://localhost:5000/api/organizationData/",
        values
      );

      console.log("Server response:", response.data);

      // Check if the response indicates success
      if (response.data && response.data.success) {
        setNotification({
          open: true,
          message: "Organisation data submitted successfully!",
          severity: "success",
        });
        resetForm();
      } else {
        throw new Error(response.data.message || "Unexpected server response");
      }
    } catch (error) {
      // Detailed error logging
      console.error("Error response details:", error.response);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);

      setNotification({
        open: true,
        message: `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred"
        }`,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
    <Box drawerWidth={drawerWidth} sx={styles.mainContainer}>
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
                <Typography sx={styles.topHeading}>Add Organisation</Typography>
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
                      Organization Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextField(
                          "organizationName",
                          "Organization Name"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("organizationId", "Organization ID")}
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.subTitle}
                    >
                      Address
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextField("street", "Street Address")}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("city", "City")}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("state", "State")}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("country", "Country")}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("postalCode", "Postal Code")}
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.subTitle}
                    >
                      Contact Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextField(
                          "primaryContactName",
                          "Primary Contact Name"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "primaryContactEmail",
                          "Primary Contact Email",
                          "email"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "primaryContactPhone",
                          "Primary Contact Phone Number"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "organisationEmail",
                          "Organization Email",
                          "email"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "organisationPhone",
                          "Organization Phone Number"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("websiteUrl", "Website URL")}
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.subTitle}
                    >
                      Additional Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextField(
                          "industryType",
                          "Industry Type",
                          "text",
                          [
                            { value: "Education", label: "Education" },
                            { value: "Corporate", label: "Corporate" },
                            { value: "Non-Profit", label: "Non-Profit" },
                          ]
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        <Field name="comment">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              label="Comment"
                              size="small"
                              fullWidth
                              multiline
                              rows={3}
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                            />
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* form content right side */}
              <Grid item xs={12} sm={6} sx={styles.subGrid}>
                <Card sx={styles.card}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.title}
                    >
                      Subscription Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextField(
                          "subscriptionPlan",
                          "Subscription Plan",
                          "text",
                          [
                            { value: "Basic", label: "Basic" },
                            { value: "Pro", label: "Pro" },
                            { value: "Enterprise", label: "Enterprise" },
                          ]
                        )}
                      </Grid>

                      <Grid item xs={5}>
                        {renderTextField(
                          "subscriptionStartDate",
                          "Subscription Start Date",
                          "date"
                        )}
                      </Grid>
                      <Grid item xs={5}>
                        {renderTextField(
                          "subscriptionEndDate",
                          "Subscription End Date",
                          "date"
                        )}
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.subTitle}
                    >
                      User Management
                    </Typography>
                    <Grid container spacing={2}>
                      {/* <Grid item xs={10}>
                        {renderTextField(
                          "numberOfBatches",
                          "Number of Batches",
                          "number",
                          null,
                          false,
                          1
                        )}
                      </Grid> */}
                      <Grid item xs={10}>
                        {renderTextField(
                          "numberOfUsers",
                          "Number of Users",
                          "number",
                          null,
                          false,
                          1
                        )}
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.subTitle}
                    >
                      Admin Users
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextField("adminUserName", "Admin User Name")}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "adminUserPhone",
                          "Admin User Phone Number"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "adminUserEmail",
                          "Admin User Email",
                          "email"
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "password",
                          "Password",
                          "password",
                          null,
                          true
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "confirmPassword",
                          "Confirm Password",
                          "password",
                          null,
                          true
                        )}
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={styles.subTitle}
                    >
                      Optional Fields
                    </Typography>
                    {/* <Grid container spacing={2}>
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          label="logo"
                          type="file"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          label="Tax Identification Number"
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                    </Grid> */}

                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        <Field name="logo">
                          {({ field, form: { setFieldValue }, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Logo"
                              type="file"
                              InputLabelProps={{
                                shrink: true,
                                style: {
                                  fontSize: "14px",
                                  fontFamily: "Poppins",
                                  fontWeight: "400",
                                  color: "#3D3D4E",
                                },
                              }}
                              onChange={handleFileChange(setFieldValue)}
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                              sx={styles.StyledTextField}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={10}>
                        <Field name="taxNumber">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Tax Identification Number"
                              size="small"
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                              InputLabelProps={{
                                style: {
                                  fontSize: "14px",
                                  fontFamily: "Poppins",
                                  fontWeight: "400",
                                  color: "#3D3D4E",
                                },
                              }}
                              sx={styles.StyledTextField}
                            />
                          )}
                        </Field>
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

export default AddProduct;
