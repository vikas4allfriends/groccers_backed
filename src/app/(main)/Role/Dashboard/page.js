"use client";

import { useRouter } from "next/navigation";
import { Typography, Box, Grid, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SearchBox from "../../../../components/SearchBox";

import ProductCss from "../../../../css/ProductCss";
import RoleTable from "../../../../components/Tables/RoleTable";

const Role_Dashboard = ({ drawerWidth }) => {
    const router = useRouter();
    const theme = useTheme();
    const styles = ProductCss(theme);

    const handleRolesClick = () => {
        router.push("/Role/Add");
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
                        Roles Management
                    </Typography>

                    <Box sx={styles.actionBox}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleRolesClick}
                            sx={styles.addButton}
                        >
                            Add Roles
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
                        <RoleTable />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Role_Dashboard;
