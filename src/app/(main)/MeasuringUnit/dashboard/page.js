"use client";

import { useRouter } from "next/navigation";
import { Typography, Box, Grid, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchBox from "../../../../components/SearchBox";
import ProductCss from "../../../../css/ProductCss";
import MeasurmentUnitTable from "../../../../components/Tables/MeasurmentUnitTable";

const MeasuringUnit_Dashboard = ({ drawerWidth }) => {
    const router = useRouter();
    const theme = useTheme();
    const styles = ProductCss(theme);
    const handleAddOrganisationClick = () => {
        router.push("/MeasuringUnit/add");
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
                        Measuring Unit Management
                    </Typography>

                    <Box sx={styles.actionBox}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddOrganisationClick}
                            sx={styles.addButton}
                        >
                            Add Measuring Unit
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
                        <MeasurmentUnitTable />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default MeasuringUnit_Dashboard;
