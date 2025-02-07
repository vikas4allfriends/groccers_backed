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
import {Get_Shops} from '../../../services/page/Shop';
import {useSelector} from 'react-redux';

function ProductTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  // const [data, setData] = useState([]);
  const data = useSelector((store)=>store.Product_Data.ShopsList);
  console.log('data---', data)
  useEffect(() => {
    Get_Shops();
  }, []);

  return (
    <>
      <Paper sx={styles.tableContainer}>
        <Table aria-label="organization table">
          <TableHead>
            <TableRow sx={styles.tableHeadRow}>
              <TableCell sx={styles.tableCellHeader}>Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Address</TableCell>
              <TableCell sx={styles.tableCellHeader}>Contact Number</TableCell>
              {/* <TableCell sx={styles.tableCellHeader}>Plan</TableCell>
              <TableCell sx={styles.tableCellHeader}>Expires on</TableCell>
              <TableCell sx={styles.tableCellHeader}>Status</TableCell> */}
              <TableCell sx={styles.tableCellHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow sx={styles.tableRow} key={index}>                
                <TableCell sx={styles.tableCell}>
                  {row.name}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row.address.addressLine1} {row.address.addressLine2}, {row.address.city}, {row.address.state}, {row.address.country}
                </TableCell>  
                <TableCell sx={styles.tableCell}>
                  {row.address.mobileNumber}
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
