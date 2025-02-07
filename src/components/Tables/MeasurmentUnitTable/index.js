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
import { Get_Measurment_Unit } from "../../../services/page/MeasurmentUnit";
import {useSelector} from 'react-redux';

function MeasurmentUnitTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  // const [data, setData] = useState([]);
  const data = useSelector((store)=>store.Product_Data.measurmentUnit)
  console.log('measuringUnitData==', data)
  useEffect(() => {
    Get_Measurment_Unit();
  }, []);

  return (
    <>
      <Paper sx={styles.tableContainer}>
        <Table aria-label="organization table">
          <TableHead>
            <TableRow sx={styles.tableHeadRow}>
              <TableCell sx={styles.tableCellHeader}>Name</TableCell>
              <TableCell sx={styles.tableCellHeader}>Description</TableCell>
              <TableCell sx={styles.tableCellHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow sx={styles.tableRow} key={index}>                
                <TableCell sx={styles.tableCell}>
                  {row.Name}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {row.Description}
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

export default MeasurmentUnitTable;
