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
import {Get_Product_Category} from '../../../services/page/ProductCategory';
import {useSelector} from 'react-redux';

function ProductCategoryTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  // const [data, setData] = useState([]);
  const data = useSelector((store)=>store.Product_Data.productCategories)
  console.log('data==', data)
  useEffect(() => {
    Get_Product_Category()
  }, [])
  

  return (
    <>
      <Paper sx={styles.tableContainer}>
        <Table aria-label="organization table">
          <TableHead>
            <TableRow sx={styles.tableHeadRow}>
              {/* <TableCell sx={styles.tableCellHeader}>Logo</TableCell>
              <TableCell sx={styles.tableCellHeader}>ID</TableCell> */}
              <TableCell sx={styles.tableCellHeader}>Name</TableCell>
              {/* <TableCell sx={styles.tableCellHeader}>Plan</TableCell>
              <TableCell sx={styles.tableCellHeader}>Expires on</TableCell>
              <TableCell sx={styles.tableCellHeader}>Status</TableCell> */}
              <TableCell sx={styles.tableCellHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow sx={styles.tableRow} key={index}>
                {/* <TableCell sx={styles.tableCell}>
                  <Avatar sx={styles.avatar} />
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row.subscriptionId}
                </TableCell> */}
                <TableCell sx={styles.tableCell}>
                  {row.Name}
                </TableCell>
                {/* <TableCell sx={styles.tableCell}>
                  {row.subscriptionPlan}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row.subscriptionEndDate}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  <Typography
                    sx={{
                      ...styles.statusTypography,
                      ...(row.Status.toLowerCase() === "active"
                        ? styles.statusActive
                        : styles.statusDeactive),
                    }}
                  >
                    {row.Status}
                  </Typography>
                </TableCell> */}
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

export default ProductCategoryTable;
