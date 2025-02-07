"use client";

import { useRouter } from "next/navigation";
import { Typography, Box, Grid, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchBox from "../../../../components/SearchBox";

import ProductCss from "../../../../css/ProductCss";
import PurchaseOrderTable from "../../../../components/Tables/PurchaseOrderTable";

const PurchaseOrder = ({ drawerWidth }) => {
    const router = useRouter();
    const theme = useTheme();
    const styles = ProductCss(theme);

    const handleAddOrganisationClick = () => {
        router.push("/purchaseOrder/add");
    };

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
                {/*  Header Section */}
                <Box sx={styles.headingBox}>
                    <Typography variant="body1" sx={styles.pageTitle}>
                        Purchase Order Management
                    </Typography>

                    <Box sx={styles.actionBox}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddOrganisationClick}
                            sx={styles.addButton}
                        >
                            Add Purchase Order
                        </Button>

                        <Box
                            sx={{
                                width: { xs: "100%", sm: "240px" },
                                minWidth: { sm: "240px" },
                            }}
                        >
                            <SearchBox />
                        </Box>
                    </Box>
                </Box>

                {/* Table Section  */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {/* Table content */}
                        <PurchaseOrderTable />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default PurchaseOrder;
