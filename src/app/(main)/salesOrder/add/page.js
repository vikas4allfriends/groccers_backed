'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Snackbar
} from '@mui/material';
import { useSnackbar } from 'notistack';
import debounce from 'lodash/debounce';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import withAuth from '../../../../hoc/withAuth';
import { useRouter } from "next/navigation";
import api from '../../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { SET_NOTIFICATION } from '../../../../constants';
import { Set_Notification } from '../../../../services/page/common';
import { green } from "@mui/material/colors";
import Grid from '@mui/material/Grid2';

const SalesOrder = () => {
  const dispatch = useDispatch();
  const shopRef = useRef(null);
  const productRef = useRef(null);
  const router = useRouter();
  const [productSuggestions, setProductSuggestions] = useState({});
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const notification = useSelector((store) => store.Common_Data.notification);

  // validationSchema
  const validationSchema = Yup.object().shape({
    ShopId: Yup.string().required("Shop name is required"),
    // items: Yup.array().of(
    //   Yup.object().shape({
    //     // productId: Yup.string().required("Product is required"),
    //     // MUQ: Yup.number().min(0, "MUQ cannot be negative").required("MUQ is required"),
    //     // quantity: Yup.number()
    //     //   .when("MUQ", {
    //     //     is: 0,
    //     //     then: Yup.number().min(1, "Units must be greater than 0 when MUQ is 0").required("Units is required"),
    //     //     otherwise: Yup.number().min(0, "Units must be non-negative"),
    //     //   }),
    //   })
    // ),
  });

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    Set_Notification({
      open: false,
      message: '',
      severity: ''
    })
  };

  // Function to close suggestions when clicking outside
  const handleClickOutside = (event) => {
    if (shopRef.current && !shopRef.current.contains(event.target)) {
      setCustomerSuggestions([]); // Clear shop suggestions
    }
    if (productRef.current && !productRef.current.contains(event.target)) {
      setCustomerSuggestions([]); // Clear product suggestions
    }
  };


  useEffect(() => {
    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initialValues = {
    items: [],
    CustomerName: '',
    CustomerId: '',
    SalesDate: null,
    isAddNewCustomer: false
  };

  // Debounced shop search
  const handleCustomerSearchDebounced = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        try {
          const res = await api.get('/Customer/SearchCustomer', {
            params: { q: query, page: 1, limit: 10 },
          });
          setCustomerSuggestions(res.data.customers || []);
        } catch (error) {
          enqueueSnackbar('Failed to fetch shops.', { variant: 'error' });
        }
      } else {
        setCustomerSuggestions([]);
      }
    }, 300),
    []
  );

  const handleCustomerSearch = (query, values, setFieldValue) => {
    setFieldValue('CustomerName', query)
    handleCustomerSearchDebounced(query);
  };

  // Handle shop selection
  const handleCustomerSelect = (customer, setFieldValue) => {
    // setShopSearch(shop.name);
    // console.log('handleShopSelect==', shop)
    setFieldValue('CustomerId', customer._id)
    setFieldValue('customerName', customer.name)
    setCustomerSuggestions([]);
    console.log('customer==', customer)
  };

  // Debounced product search
  const handleProductSearchDebounced = useCallback(
    debounce(async (query, index) => {
      if (!query.trim() || query.length <= 2) return;

      try {
        const res = await api.get('/Product/SearchProduct', {
          params: { q: query, page: 1, limit: 10 },
        });

        setProductSuggestions((prev) => ({
          ...prev,
          [index]: res?.data?.products || [],
        }));
      } catch (error) {
        enqueueSnackbar('Failed to fetch products.', { variant: 'error' });
      }
    }, 300),
    [enqueueSnackbar]
  );


  const handleProductSearch = (query, index, values, setFieldValue, productName) => {
    const updatedItems = [...values.items];
    // console.log('updatedItems==',query, updatedItems)
    updatedItems[index].productName = query;
    setFieldValue({ ...values, items: updatedItems })
    handleProductSearchDebounced(query, index);
  };

  // Handle product selection
  const handleProductSelect = (product, index, values, setFieldValue) => {
    console.log('product>>>>', product)
    const updatedItems = [...values.items];
    updatedItems[index].productId = product._id;
    updatedItems[index].productName = product.Name;
    updatedItems[index].MeasuringUnit = product.MeasuringUnit.Name;
    updatedItems[index].MultiplyingQty = product.MeasuringUnit.Description;
    updatedItems[index].TotalStockQuantity = product.TotalStockQuantity
    updatedItems[index].PriceAtAddTime = product.Price
    // setItems(updatedItems);
    setFieldValue({ ...values, items: updatedItems })
    setProductSuggestions((prev) => ({
      ...prev,
      [index]: [],
    }));
  };

  // Add a new row
  const handleAddItem = (setFieldValue, values) => {
    const newItem = {
      productId: '',
      quantity: '',
      price: '',
      productName: '',
      expiryDate: null,
      MeasuringUnit: '',
      MUQ: 0,
      PricePerUnit: 0,
      PricePerMeasuringUnit: 0,
      TotalPrice: 0
    };

    // Ensure the array updates correctly
    setFieldValue('items', [...values.items, newItem]);
  };

  // Remove a row
  const handleRemoveItem = (index, values, setFieldValue) => {
    const newItems = values.items.filter((_, i) => i !== index);
    // setItems(newItems);
    setFieldValue('items', newItems)
  };

  // Submit the purchase order
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { items, SalesDate, CustomerName, CustomerId } = values;
      console.log('handleSubmit==', values)
      const Cart = items.map((item) =>
      ({
        "ProductId": item.productId,
        "Quantity": item.quantity,
        "PriceAtAddTime": item.PriceAtAddTime
      })
      );
      console.log('handleSubmit items--', Cart, SalesDate)
      const response = await api.post('/SalesOrder', { CustomerName, Cart, SalesDate, CustomerId });
      if (response.data.success) {
        resetForm()
        dispatch({
          type: SET_NOTIFICATION,
          payload: {
            open: true,
            message: "Sales data submitted successfully!",
            severity: "success",
          }
        })

      } else {
        enqueueSnackbar(response.data.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred. Please try again later.', { variant: 'error' });
    }
  };

  const handleMeasuringQtyChange = (value, index, values, setFieldValue) => {
    const updatedItems = [...values.items];
    console.log('handleMeasuringQtyChange==', value, updatedItems[index])
    updatedItems[index].quantity = value;
    updatedItems[index].MUQ = Math.floor(value / updatedItems[index].MultiplyingQty) + '/' + value % updatedItems[index].MultiplyingQty;
    updatedItems[index].TotalPrice = value * updatedItems[index].PriceAtAddTime;

    if (updatedItems[index].MUQ > 0) {
      console.log('handleMeasuringQtyChange value>0--', value)
      updatedItems[index].quantity = value * updatedItems[index].MUQ;  // Recalculate quantity
      updatedItems[index].PriceAtAddTime = null; // Reset Units if MUQ is 0
      updatedItems[index].PricePerMeasuringUnit = null;
      updatedItems[index].TotalPrice = null;
    }

    // setItems(updatedItems);
    setFieldValue('items', updatedItems)
  };

  const handleMUQChange = (value, index, values, setFieldValue) => {
    const updatedItems = [...values.items];
    updatedItems[index].MUQ = value;

    if (value > 0) {
      console.log('handleMUQChange value>0--', value)
      updatedItems[index].quantity = value * (updatedItems[index].MultiplyingQty || 1);
    } else {
      updatedItems[index].quantity = null; // Reset Units if MUQ is 0
      updatedItems[index].PricePerUnit = null; // Reset Units if MUQ is 0
      updatedItems[index].PricePerMeasuringUnit = null;
      updatedItems[index].TotalPrice = null;
    }

    // setItems(updatedItems);
    setFieldValue('items', updatedItems)
  };

  const PricePerUnitChange = (value, index, values, setFieldValue) => {
    const updatedItems = [...values.items];
    updatedItems[index].PriceAtAddTime = value;

    if (value > 0) {
      updatedItems[index].PricePerMeasuringUnit = (value * updatedItems[index].MultiplyingQty);
      updatedItems[index].TotalPrice = value * (updatedItems[index].quantity || 1);
    } else {
      updatedItems[index].PriceAtAddTime = null; // Reset Units if MUQ is 0
      updatedItems[index].PricePerMeasuringUnit = null;
      updatedItems[index].TotalPrice = null;
    }
    setFieldValue('items', updatedItems)
    // setItems(updatedItems);
  }

  const PricePerMeasuringUnitChange = (value, index, values, setFieldValue) => {
    const updatedItems = [...values.items];
    updatedItems[index].MUQ = value;

    if (value > 0) {
      updatedItems[index].quantity = value * (updatedItems[index].MultiplyingQty || 1);
    } else {
      updatedItems[index].PricePerUnit = 0; // Reset Units if MUQ is 0
      updatedItems[index].PricePerMeasuringUnit = 0;
      updatedItems[index].TotalPrice = 0;
    }
    setFieldValue('items', updatedItems)
    // setItems(updatedItems);
  }

  const TotalPriceChange = (value, index, values, setFieldValue) => {
    const updatedItems = [...values.items];
    updatedItems[index].TotalPrice = value;

    if (value > 0) {
      updatedItems[index].PricePerMeasuringUnit = (value / updatedItems[index].quantity) * (updatedItems[index].MultiplyingQty || 1);
      updatedItems[index].PricePerUnit = value / updatedItems[index].quantity;
    } else {
      updatedItems[index].PricePerUnit = null; // Reset Units if MUQ is 0
      updatedItems[index].PricePerMeasuringUnit = null;
      updatedItems[index].TotalPrice = null;
    }
    setFieldValue('items', updatedItems)
    // setItems(updatedItems);
  }

  const expiryDateChange = (date, index, values, setFieldValue) => {
    const updatedItems = [...values.items];
    updatedItems[index].expiryDate = date;
    setFieldValue('items', updatedItems)
  }

  const navigation = (page) => {
    router.push(`/${page}`);
  };

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setValues, setFieldValue, resetForm }) => (
        <Form>
          <Container maxWidth={false} sx={{ padding: '10px', backgroundColor: '#fff' }}>

            <Box
              container
              fullWidth
              style={{ marginBottom: '15px', alignItems: 'center', backgroundColor: '#fff' }}
            >
              <Box sx={{
                flexDirection: 'row', display: 'flex', gap: 15, justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h4" >
                  Add Sales Items
                </Typography>
                <Box style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Grid item>
                    <Button onClick={() => navigation('/product/add')} variant="contained" color="primary">
                      ADD PRODUCT
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={() => navigation('MeasuringUnit/add')} variant="contained" color="success">
                      ADD MEASURING UNIT
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={() => navigation('ProductCompany/Add')} variant="contained" color="success">
                      ADD COMPANY
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={() => navigation('shop/add')} variant="contained" color="success">
                      ADD SHOP
                    </Button>
                  </Grid>
                </Box>
              </Box>
            </Box>

            {/* Shop Selection */}
            <Grid container spacing={2}>
              <Grid item
                size={{ xs: 4, md: 6, lg: 4 }}
                ref={shopRef}
              >
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <TextField
                    label="Search Customer"
                    fullWidth
                    size='small'
                    value={values.customerName}
                    onChange={(e) => handleCustomerSearch(e.target.value, values, setFieldValue)}
                    helperText="Start typing to search for customer"
                  />
                  {/* {renderTextFieldSmall("shopSearch", "Search Shop", 'text', null, false, null, (e) => handleShopSearch(e.target.value))} */}
                  {customerSuggestions.length > 0 && (
                    <Paper style={{ position: 'absolute', zIndex: 10, maxHeight: '150px', overflowY: 'auto', width: '100%' }}>
                      <List>
                        {customerSuggestions.map((customer) => (
                          <ListItem key={customer._id} button onClick={() => handleCustomerSelect(customer, setFieldValue)}>
                            <ListItemText
                              primary={customer.name}
                            // secondary={`${shop.address?.city || ''}, ${shop.address?.state || ''}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>
              </Grid>

              <Grid item xs={6} md={4} lg={3}>
                <LocalizationProvider size='small' dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Sales Date"
                    value={values.SalesDate}
                    onChange={(date) => {
                      setValues({ ...values, SalesDate: date })
                      console.log('date---', date.toISOString())
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        size: "small", // ✅ Ensures smaller text field
                      },
                    }} s
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

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

            {/* Product Selection */}
            <Table style={{ marginTop: '20px', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Measuring Unit</TableCell>
                  <TableCell>Total Stock Quantity</TableCell>
                  <TableCell>Qty. In Units</TableCell>
                  <TableCell>Price/Unit</TableCell>
                  <TableCell>Price/MeasuringUnit</TableCell>
                  <TableCell>Total Price</TableCell>
                  {/* <TableCell>Expiry Date</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell ref={productRef}>
                      <TextField
                        label="Search Product"
                        fullWidth
                        value={item.productName}
                        onChange={(e) => handleProductSearch(e.target.value, index, values, setFieldValue, 'productName')}
                      />
                      {productSuggestions[index]?.length > 0 && (
                        <Paper
                          style={{
                            position: 'absolute',
                            zIndex: 10,
                            maxHeight: '150px',
                            overflowY: 'auto',
                            width: '100%',
                          }}
                        >
                          <List>
                            {productSuggestions[index].map((product) => (
                              <ListItem key={product._id} button onClick={() => handleProductSelect(product, index, values, setFieldValue)}>
                                <ListItemText primary={product.Name} secondary={`Price: ${product.Price}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      )}
                    </TableCell>
                    {/* {console.log('item--', item)} */}
                    <TableCell>
                      <TextField
                        value={item.MeasuringUnit}
                        disabled
                        fullWidth
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        value={item.TotalStockQuantity}
                        // onChange={(e) => handleMUQChange(e.target.value, index, values, setFieldValue)}
                        // label="MUQ"
                        fullWidth
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleMeasuringQtyChange(e.target.value, index, values, setFieldValue)}
                        label="Units"
                        fullWidth
                      // error={formik.touched.items?.[index]?.quantity && Boolean(formik.errors.items?.[index]?.quantity)}
                      // helperText={formik.touched.items?.[index]?.quantity && formik.errors.items?.[index]?.quantity}
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        value={item.PriceAtAddTime}
                        onChange={(e) => PricePerUnitChange(e.target.value, index, values, setFieldValue)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.PricePerMeasuringUnit}
                        onChange={(e) => PricePerMeasuringUnitChange(e.target.value, index, values, setFieldValue)}
                        fullWidth
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.TotalPrice}
                        onChange={(e) => TotalPriceChange(e.target.value, index, values, setFieldValue)}
                        fullWidth
                        disabled
                      />
                    </TableCell>
                    {/* <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Expiry Date"
                          value={item.expiryDate}
                          onChange={(date) => expiryDateChange(date,index, values, setFieldValue)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                    </TableCell> */}
                    <TableCell>
                      <Button onClick={() => handleRemoveItem(index, values, setFieldValue)} color="secondary">
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Sticky Buttons */}
            <Grid
              container
              justifyContent="flex-end"
              spacing={2}
              style={{ marginTop: '20px', position: 'sticky', bottom: 0, background: '#fff', zIndex: 2 }}
            >
              <Grid item>
                <Button onClick={() => handleAddItem(setFieldValue, values)} variant="contained" color="primary">
                  Add Item
                </Button>
              </Grid>
              <Grid item>
                <Button type='submit' variant="contained" color="success">
                  Submit Order
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Form>
      )}
    </Formik>
  );
};

export default withAuth(SalesOrder);
