"use client";

import React, {useEffect} from "react";
import {
    Drawer as MuiDrawer,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    useTheme,
} from "@mui/material";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import DrawerCss from '../../css/DrawerCss'
import { usePathname } from 'next/navigation';
import {useSelector} from 'react-redux';

const drawerWidth = 235;

const Drawer = styled(MuiDrawer)`
  ${(props) =>
        props.variant === "temporary" &&
        `
    display: block;
    @media (min-width: 600px) {
      display: none;
    }
  `}
  ${(props) =>
        props.variant === "permanent" &&
        `
    display: none;
    @media (min-width: 600px) {
      display: block;
    }
  `}
  .MuiDrawer-paper {
    box-sizing: border-box;
    width: ${drawerWidth}px;
    background-color: #2a2927;
    color: #ffffff;
    border-right: none;
  }
`;

function SideDrawer({ mobileOpen, handleDrawerToggle }) {


    const theme = useTheme();
    const router = useRouter();
    const styles = DrawerCss(theme);
    const pathname = usePathname();

    // const token = useSelector((store)=> store.Auth_Data.token)
    // console.log('token in Provider', token)
    //   useEffect(() => {
    //     if(!token){
    //     router.push('/Login')
    //     }
    //   }, [token])

    const menuItems = [
        { text: "DASHBOARD", path: "/" },
        { text: "SHOP", path: "/shop/dashboard" },
        { text: "PURCHASE ORDER", path: "/purchaseOrder/dashboard" },
        { text: "SALES ORDER", path: "/salesOrder" },
        { text: "PRODUCT MANAGEMENT", path: "/product/dashboard" },
        { text: "PRODUCT CATEGORY", path: "/productCategory/dashboard" },
        { text: "MEASURMENT UNIT", path: "/MeasuringUnit/dashboard" },
    ];

    const handleLogout =()=>{
        try {
            localStorage.removeItem('token')
            window.location.replace("/auth/Login");
        } catch (e) {
            alert('Error '+e)
        }
    }

    const bottomMenuItems = [
        {text:"LOG OUT", onClick:handleLogout}, 
        {text:"SETTING"}, 
        {text:"HELP"}
    ];

    const handleNavigation = (path) => {
        router.push(path);
        if (mobileOpen) {
            handleDrawerToggle();
        }
    };

    const drawerContent = (
        <Box sx={styles.container}>
            <Box sx={styles.logoContainer}>
                <Typography variant="h4" sx={styles.logo}>
                    axeTyo
                </Typography>
                <Typography variant="body2" sx={styles.mainMenuText}>
                    MAIN MENU
                </Typography>
            </Box>
            <Divider sx={styles.divider}></Divider>
            <List sx={styles.listContainer}>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        onClick={() => handleNavigation(item.path)}
                        // active={pathname === item.path}
                        sx={styles.listItem}
                    >
                        <ListItemText primary={item.text} sx={styles.listItemText} />
                    </ListItem>
                ))}
            </List>
            <Box>
                <List>
                    {bottomMenuItems.map((item) => (
                        <ListItem
                            key={item.text}
                            onClick={() => item.onClick()}
                            sx={styles.listItem}
                        >
                            <ListItemText primary={item.text} sx={styles.listItemText} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                aria-label="Temporary Navigation Drawer"
                role="navigation"
            >
                {drawerContent}
            </Drawer>
            <Drawer variant="permanent" aria-label="Permanent Navigation Drawer" role="navigation">
                {drawerContent}
            </Drawer>
        </Box>
    );
}

export default SideDrawer;
