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
  TableSortLabel,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProductTableCss from "../../../css/ProductTableCss";
import { useSelector, useDispatch } from "react-redux";
import { Get_Products } from "../../../services/page/Product";

function ProductTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  const dispatch = useDispatch();

  // Local state for pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Quantity"); // Default sorting
  const [sortOrder, setSortOrder] = useState("desc"); // Default order: Descending

  const data = useSelector((store) => store.Product_Data.ProductList.products);
  const pagination = useSelector((store) => store.Product_Data.ProductList.pagination);

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;

  console.log("Current Page:", currentPage, "Total Pages:", totalPages, "Total Items:", totalItems);
  console.log("Sorting By:", sortBy, "| Order:", sortOrder);

  // Fetch products when page or sorting changes
  const GetProducts = async () => {
    Get_Products({ page: currentPage, sortBy, sortOrder });
  };

  useEffect(() => {
    GetProducts();
  }, [currentPage, sortBy, sortOrder]);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" color="textSecondary">
          No products available!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper sx={styles.tableContainer}>
        <Table aria-label="product table">
          <TableHead>
            <TableRow sx={styles.tableHeadRow}>
              <TableCell sx={styles.tableCellHeader}>Company</TableCell>
              <TableCell sx={styles.tableCellHeader}>Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Category</TableCell>
              
              {/* Sortable Columns */}
              <TableCell sx={styles.tableCellHeader}>
                <TableSortLabel
                  active={sortBy === "Price"}
                  direction={sortBy === "Price" ? sortOrder : "asc"}
                  onClick={() => handleSortChange("Price")}
                >
                  Selling Price
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={styles.tableCellHeader}>
                <TableSortLabel
                  active={sortBy === "BuyingPrice"}
                  direction={sortBy === "BuyingPrice" ? sortOrder : "asc"}
                  onClick={() => handleSortChange("BuyingPrice")}
                >
                  Buying Price
                </TableSortLabel>
              </TableCell>

              <TableCell sx={styles.tableCellHeader}>
                <TableSortLabel
                  active={sortBy === "Quantity"}
                  direction={sortBy === "Quantity" ? sortOrder : "asc"}
                  onClick={() => handleSortChange("Quantity")}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>

              <TableCell sx={styles.tableCellHeader}>Expires on</TableCell>
              <TableCell sx={styles.tableCellHeader}>Tags</TableCell>
              <TableCell sx={styles.tableCellHeader}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow sx={styles.tableRow} key={index}>
                <TableCell sx={styles.tableCell}>
                  {row?.ProductCompany?.Name || "N/A"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row?.Name || "N/A"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row?.ProductCategory?.Name || "N/A"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row?.Price || "N/A"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row?.AverageBuyingPrice || "N/A"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row?.TotalStockQuantity ?? "N/A"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row.Batches?.length > 0 ?
                    new Date(row.Batches[0]?.ExpiryDate).toLocaleDateString() :
                    "Never"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {Array.isArray(row?.Tags) ? row.Tags.join(", ") : "No Tags"}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </Button>
        <Typography sx={{ mx: 2 }}>Page {currentPage} of {totalPages}</Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        >
          Next
        </Button>
      </Box>
    </>
  );
}

export default ProductTable;
