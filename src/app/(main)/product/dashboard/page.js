"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Grid,
  Button,
  useTheme,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductCss from "../../../../css/ProductCss";
import ProductTable from "../../../../components/Tables/ProductTable";
import { handleProductSearchDebounced, Get_Products, GetProductCategories_GetProductCompanies } from '../../../../services/page/Product';
import { useSelector } from 'react-redux';

const Product_Dashboard = ({ drawerWidth }) => {
  const productRef = useRef(null);
  const router = useRouter();
  const theme = useTheme();
  const styles = ProductCss(theme);
  const { productCategories, productCompanies } = useSelector((state) => state.Product_Data)
  console.log('productCategories, productCompanies===', productCategories, productCompanies)

  // Search state for filtering categories
  const [categorySearch, setCategorySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  // State for filters
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    company: "",
  });

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    console.log('key,value===',key,value)
    Get_Products({[key]:value})
    // Optionally trigger API call here for filtering
  };

  const handleProductSearch = useCallback(
    handleProductSearchDebounced,
    []
  );

  const handleAddProductClick = () => {
    router.push("/product/add");
  };

  useEffect(() => {
    GetProductCategories_GetProductCompanies()
  }, [])

  return (
    <Box sx={styles.containerBox}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Header Section */}
        <Box sx={styles.headingBox}>
          <Typography variant="body1" sx={styles.pageTitle}>
            Product Management
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddProductClick}
              sx={styles.addButton}
            >
              Add Product
            </Button>

            {/* Filter Dropdowns */}
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box ref={productRef}>
                  <TextField
                    label="Search Product"
                    fullWidth
                    size="small"
                    value={filters.name}
                    onChange={(e) => {
                      setFilters({ ...filters, name: e.target.value })
                      handleProductSearch(e.target.value)
                    }}
                  />
                </Box>
              </Grid>

              {/* Category Filter with Searchable Dropdown */}
              <Grid item fullWidth>
                <Autocomplete
                  options={productCategories.filter((category) =>
                    category.Name.toLowerCase().includes(categorySearch.toLowerCase())
                  )}
                  fullWidth
                  getOptionLabel={(option) => option.Name}
                  onChange={(event, value) =>
                    handleFilterChange("ProductCategoryId", value ? value._id : "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Category"
                      fullWidth
                      size="small"
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                  )}
                />
              </Grid>
              {/* Company Filter */}
              <Grid item>
                <Autocomplete
                  options={productCompanies.filter((company) =>
                    company.Name.toLowerCase().includes(companySearch.toLowerCase())
                  )}
                  getOptionLabel={(option) => option.Name}
                  onChange={(event, value) =>
                    handleFilterChange("ProductCompanyId", value ? value._id : "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Company"
                      fullWidth
                      size="small"
                      onChange={(e) => setCompanySearch(e.target.value)}
                    />
                  )}
                />
              </Grid>
              {/* Reset Filters Button */}
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    setFilters({ name: "", category: "", company: "" });
                    Get_Products();
                  }}
                >
                  ALL
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Table Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProductTable filters={filters} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Product_Dashboard;
