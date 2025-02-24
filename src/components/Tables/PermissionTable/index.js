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
import {Get_Permission, Delete_Permission} from '../../../services/page/Permission';
import {useSelector} from 'react-redux';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UpdateIcon from '@mui/icons-material/Update';
import {navigate} from '../../../utils/navigation';

function PermissionTable() {
  const theme = useTheme();
  const styles = ProductTableCss(theme);
  // const [data, setData] = useState([]);
  const data = useSelector((store)=>store.Common_Data.permissions.PermissionList)
  console.log('data==', data)

  useEffect(() => {
    Get_Permission()
  }, [])
  
    const handleUpdateClick = (unit) => {
      navigate(`/Permission/Add?edit=${unit._id}`); // Navigate with query param
    };
  
    const handleDeleteClick = (row) => {
      Delete_Permission({id:row._id, modelName:'UserPermissions'})
    };

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
                  {row.name}
                </TableCell>                
                <TableCell sx={styles.tableCell}>
                  <IconButton size="small" onClick={() => handleUpdateClick(row)}>                    
                    <UpdateIcon />
                  </IconButton>

                  <IconButton size="small" onClick={() => handleDeleteClick(row)}>                    
                    <DeleteOutlineOutlinedIcon color='danger' sx={{color:'red'}} />
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

export default PermissionTable;
