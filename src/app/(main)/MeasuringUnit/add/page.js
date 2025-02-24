'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Typography,
  CardContent,
  Snackbar,
  Alert,
  useTheme,
  TextField,
  Box,
  Button,
  Card,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { green } from "@mui/material/colors";
import { useSelector } from 'react-redux';
import AddProductCss from "../../../../css/AddProductCss";
import { Set_Notification } from '../../../../services/page/common';
import { Add_Measurment_Unit, Update_Measurment_Unit } from '../../../../services/page/MeasurmentUnit';
import { useSearchParams } from "next/navigation"; // Import search params
import Custom_Snackbar from '../../../../components/Snackbar';

// Validation Schema
const validationSchema = Yup.object().shape({
  Name: Yup.string().required('Name is required'),
  Description: Yup.string().required('Description is required')
});

const AddMeasuringUnit = ({ drawerWidth, measuringUnit = null }) => {
  const theme = useTheme();
  const styles = AddProductCss(theme);
  const router = useRouter();
  const notification = useSelector((store) => store.Common_Data.notification);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit"); // Get the ID from URL
  // const unitData = router.state?.unitData || null; // Retrieve data from router
  const measurementUnits  = useSelector((store) => store.Product_Data.measurmentUnit)

  // console.log('router===',router)
  const onSubmit = async (values, {resetForm}) => {
    if (editId) {
      Update_Measurment_Unit({...values, measuringUnitId:editId}); // Update API
    } else {
      Add_Measurment_Unit(values, resetForm); // Create API
    }
  };

  const handleBackClick = () => router.push("/MeasuringUnit/dashboard");

  const handleCancelClick = () => router.push("/MeasuringUnit/dashboard");

  useEffect(() => {
    if (editId) {
      const unitData = measurementUnits.find((unit) => unit._id === editId);
      // console.log('unitData==',unitData)
      if (unitData) {
        setInitialValues({
          ...initialValues,
          Name: unitData.Name,
          Description: unitData.Description,
        });
      }
    }
  }, [editId, measurementUnits]);

  const [initialValues, setInitialValues] = useState({
    Name: "",
    Description: "",
    IsActive:true,
    IsDeleted:false
  });

  return (
    <Box drawerwidth={drawerWidth} sx={styles.mainContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting, resetForm }) => (
          <Form>
            {/* Navigation Header */}
            <Box sx={styles.navContainer}>
              <Box sx={styles.headingBox}>
                <Button variant="text" onClick={handleBackClick} sx={styles.backButton}>
                  <KeyboardBackspaceIcon />
                </Button>
                <Typography sx={styles.topHeading}>
                  {measuringUnit ? "Update Measuring Unit" : "Add Measuring Unit"}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={styles.buttonBox}>
                <Button variant="outlined" disabled={isSubmitting} type="submit" sx={styles.actionButton}>
                  {measuringUnit ? "Update" : "Save"}
                </Button>
                <Button variant="outlined" onClick={handleCancelClick} sx={styles.actionButton}>
                  Cancel
                </Button>
              </Box>
            </Box>

            {/* Snackbar Notification */}
            {/* <Custom_Snackbar /> */}
            {/* Form Content */}
            <Grid container maxWidth={true} size={{ xs: 6, md: 8, lg: 6 }} spacing={1} sx={styles.mainGrid}>
              <Card sx={styles.card}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={styles.title}>
                    Measuring Unit Information
                  </Typography>
                  <Grid size={{ xs: 6, md: 8, lg: 6 }} container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid item xs={10}>
                      <Field name="Name">
                        {({ field, meta }) => (
                          <TextField
                            {...field}
                            label="Measuring Unit Name"
                            size="small"
                            fullWidth
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
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
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddMeasuringUnit;
