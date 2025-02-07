'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Grid,
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
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from '../../../components/axios';
import debounce from 'lodash/debounce';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Get_Products } from '../../../services/page/Product';
import { useSelector } from 'react-redux';
import api from '../../../services/api';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {renderTextFieldSmall} from '../../../components/TextField';
import withAuth from '../../../hoc/withAuth';

const AddPurchaseItems = () => {
  const [items, setItems] = useState([{ productId: '', quantity: '', price: '', productName: '', expiryDate: null }]);
  const [shopSearch, setShopSearch] = useState('');
  const [PurchaseDate, setPurchaseDate] = useState(null)
  const [shopId, setShopId] = useState('');
  const [productSuggestions, setProductSuggestions] = useState({});
  const [shopSuggestions, setShopSuggestions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [expiryDate, setExpiryDate] = useState(null);
  // const productList = useSelector((store)=>store.Product_Data.productList)

  // validationSchema
  const validationSchema = Yup.object().shape({
    ShopId: Yup.string().required("Shop name is required"),
  });
  
  const initialValues = {
    items: [{ productId: '', quantity: '', price: '', productName: '', expiryDate: null }],
    PurchaseDate: null,
    shopId: ''
  };

  // Debounced shop search
  const handleShopSearchDebounced = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        try {
          const res = await axios.get('/Shop/Search', {
            params: { q: query, page: 1, limit: 10 },
          });
          setShopSuggestions(res.data.shops || []);
        } catch (error) {
          enqueueSnackbar('Failed to fetch shops.', { variant: 'error' });
        }
      } else {
        setShopSuggestions([]);
      }
    }, 300),
    []
  );

  const handleShopSearch = (query) => {
    setShopSearch(query);
    handleShopSearchDebounced(query);
  };

  // Debounced product search
  const handleProductSearchDebounced = useCallback(
    debounce(async (query, index) => {
      if (query.length > 2) {
        try {
          const res = await api.get('/Product/SearchProduct', {
            params: { q: query, page: 1, limit: 10 },
          });
          console.log('res---', res)
          setProductSuggestions((prev) => ({
            ...prev,
            [index]: res.data.products || [],
          }));
          Get_Products({ q: query, page: 1, limit: 10 },)
        } catch (error) {
          enqueueSnackbar('Failed to fetch products.', { variant: 'error' });
        }
      } else {
        setProductSuggestions((prev) => ({
          ...prev,
          [index]: [],
        }));
      }
    }, 300),
    []
  );

  const handleProductSearch = (query, index) => {
    const updatedItems = [...items];
    updatedItems[index].productName = query;
    setItems(updatedItems);
    handleProductSearchDebounced(query, index);
  };

  // Handle shop selection
  const handleShopSelect = (shop) => {
    setShopSearch(shop.name);
    setShopId(shop._id);
    setShopSuggestions([]);
  };

  // Handle product selection
  const handleProductSelect = (product, index) => {
    const updatedItems = [...items];
    updatedItems[index].productId = product._id;
    updatedItems[index].productName = product.Name;
    setItems(updatedItems);
    setProductSuggestions((prev) => ({
      ...prev,
      [index]: [],
    }));
  };

  // Add a new row
  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '', price: '', productName: '', expiryDate: null }]);
  };

  // Remove a row
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Submit the purchase order
  const handleSubmit = async () => {
    try {
      console.log('items--', items, PurchaseDate)
      const response = await api.post('/PurchaseOrder/Add', { shopId, products: items, PurchaseDate });
      if (response.data.success) {
        enqueueSnackbar('Purchase order created successfully!', { variant: 'success' });
        setItems([{ productId: '', quantity: '', price: '', productName: '', expiryDate: null }]); // Reset form
        setShopSearch('');
        setShopId('');
      } else {
        enqueueSnackbar(response.data.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred. Please try again later.', { variant: 'error' });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Container maxWidth="md" style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
              Add Purchase Items
            </Typography>

            {/* Shop Selection */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                {/* <TextField
                  label="Search Shop"
                  fullWidth
                  value={shopSearch}
                  onChange={(e) => handleShopSearch(e.target.value)}
                  helperText="Start typing to search for shops"
                /> */}
                {renderTextFieldSmall("shopSearch", "Search Shop", 'text', null, false, null,(e) => handleShopSearch(e.target.value) )}
                {shopSuggestions.length > 0 && (
                  <Paper style={{ position: 'absolute', zIndex: 10, maxHeight: '150px', overflowY: 'auto', width: '100%' }}>
                    <List>
                      {shopSuggestions.map((shop) => (
                        <ListItem key={shop._id} button onClick={() => handleShopSelect(shop)}>
                          <ListItemText primary={shop.name} secondary={`${shop.address?.city || ''}, ${shop.address?.state || ''}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Grid>
              <Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Expiry Date"
                    // value={item.expiryDate}
                    onChange={(date) => {
                      setPurchaseDate(date)
                      console.log('date---', date.toISOString())
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            {/* Product Selection */}
            <Table style={{ marginTop: '20px', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        label="Search Product"
                        fullWidth
                        value={item.productName}
                        onChange={(e) => handleProductSearch(e.target.value, index)}
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
                              <ListItem key={product._id} button onClick={() => handleProductSelect(product, index)}>
                                <ListItemText primary={product.Name} secondary={`Price: ${product.Price}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          setItems(
                            items.map((itm, idx) =>
                              idx === index ? { ...itm, quantity: e.target.value } : itm
                            )
                          )
                        }
                        label="Quantity"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          setItems(
                            items.map((itm, idx) =>
                              idx === index ? { ...itm, price: e.target.value } : itm
                            )
                          )
                        }
                        label="Price"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Expiry Date"
                          value={item.expiryDate}
                          onChange={(date) => {
                            setItems(
                              items.map((itm, idx) =>
                                idx === index ? { ...itm, expiryDate: date } : itm
                              )
                            )
                            console.log('date---', date.toISOString())
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleRemoveItem(index)} color="secondary">
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
                <Button onClick={handleAddItem} variant="contained" color="primary">
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

export default withAuth(AddPurchaseItems);
