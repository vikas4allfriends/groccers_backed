import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const PurchaseOrderReceipt = ({ open, onClose, order }) => {
  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content").innerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Purchase Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Purchase Order Receipt</DialogTitle>
      <DialogContent>
        <Box id="receipt-content">
          {/* Shop Information */}
          <Typography variant="h6" gutterBottom>
            {order.ShopName}
          </Typography>
          <Typography variant="body2">
            {order.ShopAddress.addressLine1}, {order.ShopAddress.city}, {order.ShopAddress.state}, {order.ShopAddress.country}
          </Typography>
          <Typography variant="body2">Phone: {order.ShopAddress.mobileNumber}</Typography>
          <Typography variant="body2">Purchase Date: {new Date(order.PurchaseDate).toLocaleDateString()}</Typography>

          {/* Items Table */}
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.Items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.ProductName?.Name || "N/A"}</TableCell>
                  <TableCell>{item.Quantity}</TableCell>
                  <TableCell>₹{item.PriceAtPurchaseTime.toFixed(2)}</TableCell>
                  <TableCell>₹{(item.Quantity * item.PriceAtPurchaseTime).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Total Price */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ₹{order.TotalPrice.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={handlePrint} color="primary" variant="contained">
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderReceipt;
