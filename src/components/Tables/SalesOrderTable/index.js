import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  Paper,
  IconButton,
  Box,
  TableCell,
  TableRow,
  Button,
  useTheme,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from '@mui/icons-material/Print';
import ProductTableCss from "../../../css/ProductTableCss";
import { Get_SalesOrder } from "../../../services/page/SalesOrder";
import { useSelector, useDispatch } from "react-redux";

const getOrderReceiptHTML = (order) => {
  if (!order) return "<p>No order selected.</p>";

  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h2>Order Receipt</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Customer:</strong> ${order.CustomerRefId?.name || "Guest"}</p>
      <p><strong>Date:</strong> ${new Date(order.SalesDate).toLocaleDateString()}</p>
      <table>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
        ${order.Items.map(item => `
          <tr>
            <td>${item.ProductId?.Name || "N/A"}</td>
            <td>${item.Quantity}</td>
            <td>₹${item.PriceAtAddTime}</td>
            <td>₹${(item.Quantity * item.PriceAtAddTime).toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr class="total">
          <td colspan="3">Subtotal</td>
          <td>₹${order.TotalPrice.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="3">Discount</td>
          <td>₹${order.Discount || 0}</td>
        </tr>
        <tr>
          <td colspan="3">Delivery Charge</td>
          <td>₹${order.DeliveryCharge || 0}</td>
        </tr>
        <tr class="total">
          <td colspan="3">Final Amount</td>
          <td>₹${(order.TotalPrice - (order.Discount || 0) + (order.DeliveryCharge || 0)).toFixed(2)}</td>
        </tr>
      </table>
      <p><strong>Payment Status:</strong> ${order.IsPaid ? "Paid" : "Unpaid"}</p>
      <p><strong>Payment Method:</strong> ${order.IsCashOnDelivery ? "Cash on Delivery" : "Online Payment"}</p>
      <div class="footer">
        <p>Thank you for your order!</p>
      </div>
    </body>
    </html>
  `;
};


function SalesTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order
  const [page, setPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // Get data from Redux store
  const SalesOrder = useSelector((store) => store.Product_Data.SalesOrder);
  const { orders, totalRecords } = SalesOrder;
  const data = orders;

  useEffect(() => {
    fetchPurchaseOrders(page);
  }, [page]);

  const fetchPurchaseOrders = async (currentPage) => {
    if (loading) return;

    setLoading(true);
    const params = {
      page: currentPage, // Current page
      limit: 5, // Number of orders per page
      // sortField: 'TotalPrice', // Sort field
      // sortOrder: 'asc',    // Sort order
      // ShopId: '64e12abc4567890d12345ef', // Shop ID (optional)
      // ShopName: 'SuperMart',             // Shop Name (optional)
      // city: 'Bareilly',
    };

    try {
      Get_SalesOrder(params);
      // const { data: { orders, totalRecords } } = response;

      if (orders.length > 0) {
        dispatch(updatePurchaseOrderList([...data, ...orders]));
      }

      // Check if there are more pages
      const totalPages = Math.ceil(totalRecords / 5);
      if (currentPage >= totalPages) setHasMore(false);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

    // Handle row click to show receipt preview
    const handleViewReceipt = (order) => {
      setSelectedOrder(order);
    };
  
    // Close receipt preview
    const handleCloseReceipt = () => {
      setSelectedOrder(null);
    };
  
    // Function to print receipt
    const handlePrintReceipt = () => {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(getOrderReceiptHTML(selectedOrder));
      printWindow.document.close();
      printWindow.print();
    };

  return (
    <>
      <Paper sx={styles.tableContainer}>
        <Table aria-label="purchase orders table">
          <TableHead>
            <TableRow sx={styles.tableHeadRow}>
              <TableCell sx={styles.tableCellHeader}>Date</TableCell>
              <TableCell sx={styles.tableCellHeader}>Customer Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Total Sales</TableCell>
              <TableCell sx={styles.tableCellHeader}>Items</TableCell>
              <TableCell sx={styles.tableCellHeader}>Action</TableCell>
              <TableCell sx={styles.tableCellHeader}>Print</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow sx={styles.tableRow} key={index}>
                  <TableCell sx={styles.tableCell}>
                    {new Date(row.SalesDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>{row.CustomerRefId?.name}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    ₹{row.TotalPrice.toFixed(2)}
                  </TableCell>
                  
                  <TableCell sx={styles.tableCell}>
                    {row.Items.map((item, idx) => (
                      <Box key={idx}>
                        <Typography variant="body2">
                          {`Name: ${item.ProductId?.Name || "N/A"}, Qty: ${item.Quantity}, Price: ₹${item.PriceAtAddTime}`}
                        </Typography>
                        {row.ProductBatchDetails?.map((batch, batchIdx) => {
                          console.log('item.ProductId === batch.ProductId', item.ProductId, batch.ProductId, (item.ProductId === batch.ProductId))
                          if (item.ProductId === batch.ProductId)
                            return (
                              <Typography key={batchIdx} variant="body2">
                                {`Batch Expiry: ${new Date(batch.ExpiryDate).toLocaleDateString()}`}
                              </Typography>
                            )
                        })}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    <IconButton size="small" onClick={() => handleViewReceipt(row)}>
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={styles.tableCell}>
                  No purchase orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 1,
        }}
      >
        <Button sx={styles.loadMoreButton} variant="text">
          Load More +
        </Button>
      </Box>

      {/* Receipt Preview Modal */}
      <Dialog open={!!selectedOrder} onClose={handleCloseReceipt} fullWidth maxWidth="sm">
        <DialogTitle>Order Receipt</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <div dangerouslySetInnerHTML={{ __html: getOrderReceiptHTML(selectedOrder) }} />
              <Button onClick={handlePrintReceipt} variant="contained" sx={{ mt: 2 }}>
                Print Receipt
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SalesTable;
