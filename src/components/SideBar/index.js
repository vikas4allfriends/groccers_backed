"use client";

import SideDrawer from "../SideDrawer";
import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";

const SideBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = 235;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <SideDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflow: "auto",
        }}
      >
        {/* {children} */}
      </Box>
    </Box>
  );
};

export default SideBar;
