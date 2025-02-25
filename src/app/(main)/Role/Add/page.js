'use client'

import React, { useEffect, useMemo, useCallback } from "react";

import { useRouter } from "next/navigation";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  Typography,
  Grid,
  CardContent,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  IconButton,
  TextField,
  Box,
  Button,
  Card,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { green } from "@mui/material/colors";
import { useSelector } from 'react-redux';
import AddProductCss from "../../../../css/AddProductCss";
import { Set_Notification } from '../../../../services/page/common';
import { renderTextFieldSmall } from '../../../../components/TextField';
import { Add_Role } from '../../../../services/page/Role';
import MultipleSelect from '../../../../components/MultipleSelect';
import { Get_Permission } from '../../../../services/page/Permission';

// validationSchema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required field'),
  // Description: Yup.string().optional().nullable()
});

const AddRole = ({ drawerWidth }) => {
  const theme = useTheme();
  const styles = AddProductCss(theme);
  const router = useRouter();

  useEffect(() => {
    Get_Permission()
  }, [])

  // const handleSelectionChange = useCallback(
  //   (selected) => {
  //     setFieldValue("permissions", selected);
  //   },
  //   [setFieldValue]
  // );

  //all the state and handler functions
  const notification = useSelector((store) => store.Common_Data.notification)
  const PermissionList = useSelector((store) => store.Common_Data.permissions.PermissionList)
  console.log('PermissionList==', PermissionList)

  // Memoize UpdatedPermissionList
  const UpdatedPermissionList = useMemo(() => {
    return PermissionList.map((item) => ({
      label: item.name,
      value: item._id,
    }));
  }, [PermissionList]);

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    Set_Notification({
      open: false,
      message: '',
      severity: ''
    });
  };

  const handleBackClick = () => {
    router.push("/Role/Dashboard");
  };

  const handleCancelClick = () => {
    router.push("/Role/Dashboard");
  };

  const initialValues = {
    name: '',
    permissions: [],
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    // Log form values before sending
    console.log("Form values being sent: ", values, resetForm);
    // Add_Product_Category(values, resetForm)
    const permissions = values.permissions.map((item) => item.value)
    console.log('permissions==', permissions)
    Add_Role(
      { name: values.name, permissions },
      resetForm
    )

  }

  return (
    <Box drawerwidth={drawerWidth} sx={styles.mainContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, resetForm, setSubmitting, values, setFieldValue }) => (
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
                <Typography sx={styles.topHeading}>Add Role</Typography>
              </Box>

              {/* ButtonBox */}
              <Box sx={styles.buttonBox}>
                {/* actionBox */}
                <Button
                  variant="outlined"
                  disabled={isSubmitting}
                  type="submit"
                  // onClick={(e) => onSubmit(values, setSubmitting, resetForm)}
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
                      Role Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        {renderTextFieldSmall(
                          "name",
                          "Role Name"
                        )}
                      </Grid>

                      <Grid item xs={10}>
                        <MultipleSelect
                          options={UpdatedPermissionList}
                          setFieldValue={setFieldValue} // Pass setFieldValue
                          selectedValues={values.permissions} // Pass selected values to keep state updated
                        />
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

export default React.memo(AddRole);
