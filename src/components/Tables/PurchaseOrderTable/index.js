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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import ProductTableCss from "../../../css/ProductTableCss";
import { Get_Purchase_Order } from "../../../services/page/PurchaseOrder";
import { useSelector, useDispatch } from "react-redux";
import PurchaseOrderReceipt from '../../../components/PrintReceipt/PurchaseOrderReceipt';

function ProductTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  const dispatch = useDispatch();
  const [openReceipt, setOpenReceipt] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // Get data from Redux store
  const PurchaseOrder = useSelector((store) => store.Product_Data.PurchaseOrder);
  const { orders, totalRecords } = PurchaseOrder;
  const data = orders;

  const handleViewReceipt = (order) => {
    setSelectedOrder(order);
    setOpenReceipt(true);
  };

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
      Get_Purchase_Order(params);
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

  return (
    <>
      <Paper sx={styles.tableContainer}>
        <Table aria-label="purchase orders table">
          <TableHead>
            <TableRow sx={styles.tableHeadRow}>
              <TableCell sx={styles.tableCellHeader}>Date</TableCell>
              <TableCell sx={styles.tableCellHeader}>Shop Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Total Price</TableCell>
              <TableCell sx={styles.tableCellHeader}>Shop Address</TableCell>
              <TableCell sx={styles.tableCellHeader}>Items</TableCell>
              <TableCell sx={styles.tableCellHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow sx={styles.tableRow} key={index}>
                  <TableCell sx={styles.tableCell}>
                    {new Date(row.PurchaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>{row.ShopName}</TableCell>
                  <TableCell sx={styles.tableCell}>
                    ₹{row.TotalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    {`${row.ShopAddress.addressLine1}, ${row.ShopAddress.city}, ${row.ShopAddress.state}, ${row.ShopAddress.country}`}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    {row.Items.map((item, idx) => (
                      <Box key={idx}>
                        <Typography variant="body2">
                          {`Name: ${item.ProductName?.Name || "N/A"}, Qty: ${item.Quantity}, Price: ₹${item.PriceAtPurchaseTime}`}
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
                  <TableCell>
                <IconButton onClick={() => handleViewReceipt(row)}>
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

      {/* Receipt Modal */}
      <PurchaseOrderReceipt
        open={openReceipt}
        onClose={() => setOpenReceipt(false)}
        order={selectedOrder}
      />

    </>
  );
}

export default ProductTable;
