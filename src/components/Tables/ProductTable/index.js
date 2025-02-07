import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  Paper,
  IconButton,
  Box,
  TableCell,
  TableRow,
  Avatar,
  Button,
  useTheme,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProductTableCss from "../../../css/ProductTableCss";
import { useSelector } from 'react-redux';
import { Get_Products } from '../../../services/page/Product';


function ProductTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  // const [data, setData] = useState([]);
  const data = useSelector((store) => store.Product_Data.ProductList)
  console.log('data===>>', data)
  useEffect(() => {
    Get_Products()
  }, []);

  if (data.length ===0) {
    return <Box>
      <Typography>
        No product available !
      </Typography>
      </Box>
  }

  return (
    <>
      <Paper sx={styles.tableContainer}>
        <Table aria-label="organization table">
          <TableHead>
            <TableRow sx={styles.tableHeadRow}>
              <TableCell sx={styles.tableCellHeader}>Name</TableCell>
              {/* <TableCell sx={styles.tableCellHeader}>Category</TableCell> */}
              <TableCell sx={styles.tableCellHeader}>Selling Price</TableCell>
              <TableCell sx={styles.tableCellHeader}>Buying Price</TableCell>
              <TableCell sx={styles.tableCellHeader}>Quantity</TableCell>
              {/* <TableCell sx={styles.tableCellHeader}>Measuring Unit</TableCell> */}
              <TableCell sx={styles.tableCellHeader}>Expires on</TableCell>
              <TableCell sx={styles.tableCellHeader}>Tags</TableCell>
              <TableCell sx={styles.tableCellHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow sx={styles.tableRow} key={index}>
                  <TableCell sx={styles.tableCell}>
                    {row.Name}
                  </TableCell>
                  {/* <TableCell sx={styles.tableCell}>
                  {row.Productcategory[0].name}
                </TableCell> */}
                  <TableCell sx={styles.tableCell}>
                    {row.Price}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    {row.AverageBuyingPrice}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    {row.TotalQuantity}
                  </TableCell>
                  {/* <TableCell sx={styles.tableCell}>
                  {row.MeasurmentUnit[0].Name}
                </TableCell> */}
                  <TableCell sx={styles.tableCell}>
                    {row.ExpiryDate ? new Date(row.Batches[0]?.ExpiryDate).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell sx={styles.tableCell}>
                    {row.Tags.toString()}
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

      <Box
        sx={{
          display: "flex",
          display: "none",
          justifyContent: "center",
          mt: 1,
        }}
      >
        <Button sx={styles.loadMoreButton} variant="text">
          Load More +
        </Button>
      </Box>
    </>
  );
}

export default ProductTable;
