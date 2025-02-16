'use client'

import React, { useEffect } from "react";

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
import { Add_Product } from '../../../../services/page/Product';
import AddProductCss from "../../../../css/AddProductCss";
import { useSelector } from 'react-redux';
import { Set_Notification } from '../../../../services/page/common';
import { Get_Measurment_Unit } from '../../../../services/page/MeasurmentUnit';
import { Get_Product_Category } from '../../../../services/page/ProductCategory';
import { Get_Product_Company } from '../../../../services/page/ProductCompany';

// validationSchema
const validationSchema = Yup.object().shape({
  ProductCategoryId: Yup.string().required("Product Category is required"),
  Name: Yup.string().required("Product Name is required"),
  Price: Yup.number().min(0, "Price must be positive").required("Price is required"),
  MeasuringUnitId: Yup.string().required("Measuring Unit is required"),
  ProductCompanyId: Yup.string().required("Product Company is required"),
  Description: Yup.string().nullable(),
  ProductImageUrl: Yup.mixed().nullable(),
  Tags: Yup.array()
    .of(Yup.string().trim().required("Tag cannot be empty")) // Ensures no empty string tags
    .min(1, "At least one tag is required") // Ensures the array has at least 1 item
});

const AddProduct = ({ drawerWidth }) => {
  const theme = useTheme();
  const styles = AddProductCss(theme);
  const router = useRouter();
  const notification = useSelector((store) => store.Common_Data.notification)
  const Product_Data = useSelector((store) => store.Product_Data)
  console.log('Product_Data--', Product_Data)
  //all the state and handler functions
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
    // setNotification({ ...notification, open: false });
    Set_Notification({
      open: false,
      message: '',
      severity: ''
    })
  };

  const handleBackClick = () => {
    router.push("/product/dashboard");
  };

  const handleCancelClick = () => {
    router.push("/product/dashboard");
  };

  const initialValues = {
    ProductCategoryId: '',
    ProductCompanyId: '',
    Name: '',
    Price: 0,
    Tags: [],
    MeasuringUnitId: '',
    Description: '',
    ProductImageUrl: ''
  };

  // for file upload
  const handleFileChange = (setFieldValue) => (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue("ProductImageUrl", file);
  };

  useEffect(() => {
    Get_Measurment_Unit(),
    Get_Product_Category()
    Get_Product_Company()
  }, [])

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Form values being sent: ", values);
    setSubmitting(true)
    Add_Product(values, resetForm);
  }

  const renderTextField = (
    name,
    label,
    type = "text",
    options = null,
    isPassword = false,
    min = null,
    rows
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
          rows={rows}
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
              <MenuItem key={option._id} value={option._id}>
                {option.Name}
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
                <Typography sx={styles.topHeading}>Add Product</Typography>
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
                      Product Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextField(
                          "Name",
                          "Product Name"
                        )}
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
                          "ProductCategoryId",
                          "Select Product Category",
                          "text",
                          Product_Data.productCategories
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "ProductCompanyId",
                          "Select Product Company",
                          "text",
                          Product_Data.productCompanies
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField(
                          "MeasuringUnitId",
                          "Select Measuring Unit",
                          "text",
                          Product_Data.measurmentUnit
                        )}
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("Price", "Price", "number")}
                      </Grid>
                      <Grid item xs={10}>
                        <Field name="Tags">
                          {({ field, meta, form: { setFieldValue } }) => (
                            <TextField
                              {...field}
                              sx={styles.StyledTextField}
                              label="Tags (comma-separated)"
                              size="small"
                              fullWidth
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                              InputLabelProps={{
                                style: {
                                  fontSize: "14px",
                                  fontFamily: "Poppins",
                                  fontWeight: "400",
                                  color: "#3D3D4E",
                                }, // Smaller label font size
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFieldValue("Tags", value.split(",").map(tag => tag.trim())); // Convert comma-separated values into an array
                              }}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item xs={10}>
                        {renderTextField("ProductImageUrl", "Product Image Url")}
                      </Grid>
                      <Grid item xs={10}>
                        <Field name="Description">
                          {({ field, meta }) => (
                            <TextField
                              {...field}
                              label="Description"
                              size="small"
                              fullWidth
                              multiline
                              rows={3}
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                              InputLabelProps={{
                                style: {
                                  fontSize: "14px",
                                  fontFamily: "Poppins",
                                  fontWeight: "400",
                                  color: "#3D3D4E",
                                }, // Smaller label font size
                              }}
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
                      sx={styles.subTitle}
                    >
                      Optional Fields
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        <Field name="logo">
                          {({ field, form: { setFieldValue }, meta }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Product Image"
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
