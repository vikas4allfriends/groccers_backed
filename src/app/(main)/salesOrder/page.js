'use client';

import React, { useState, useCallback } from 'react';
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

const AddPurchaseItems = () => {
  const [items, setItems] = useState([
    { productId: '', quantity: '', price: '', discount: '', productName: '', expiryDate: null }
  ]);
  const [shopSearch, setShopSearch] = useState('');
  const [shopId, setShopId] = useState('');
  const [productSuggestions, setProductSuggestions] = useState({});
  const [shopSuggestions, setShopSuggestions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleProductSearchDebounced = useCallback(
    debounce(async (query, index) => {
      if (query.length > 2) {
        try {
          const res = await axios.get('/Product/SearchProduct', {
            params: { q: query, page: 1, limit: 10 },
          });
          setProductSuggestions((prev) => ({
            ...prev,
            [index]: res.data.products || [],
          }));
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

  const handleProductSelect = (product, index) => {
    const updatedItems = [...items];
    updatedItems[index].productId = product._id;
    updatedItems[index].productName = product.Name;
    updatedItems[index].price = product.Price;
    setItems(updatedItems);
    setProductSuggestions((prev) => ({
      ...prev,
      [index]: [],
    }));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      let price = parseFloat(item.price) || 0;
      let quantity = parseInt(item.quantity) || 0;
      let discount = item.discount.includes('%')
        ? (parseFloat(item.discount) / 100) * price
        : parseFloat(item.discount) || 0;
      return total + (price - discount) * quantity;
    }, 0).toFixed(2);
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Add Purchase Items
      </Typography>

      <Table style={{ marginTop: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Expiry Date</TableCell>
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
                  <Paper style={{ position: 'absolute', zIndex: 10, maxHeight: '150px', overflowY: 'auto' }}>
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
                    setItems(items.map((itm, idx) =>
                      idx === index ? { ...itm, quantity: e.target.value } : itm
                    ))
                  }
                  label="Quantity"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.price}
                  disabled
                  label="Price"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={item.discount}
                  onChange={(e) =>
                    setItems(items.map((itm, idx) =>
                      idx === index ? { ...itm, discount: e.target.value } : itm
                    ))
                  }
                  label="Discount"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Expiry Date"
                    value={item.expiryDate}
                    onChange={(date) =>
                      setItems(items.map((itm, idx) =>
                        idx === index ? { ...itm, expiryDate: date } : itm
                      ))
                    }
                  />
                </LocalizationProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Total Amount: ₹{calculateTotal()}
      </Typography>
    </Container>
  );
};

export default AddPurchaseItems;
