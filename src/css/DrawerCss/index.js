const DrawerCss = (theme) => ({
    container: {
      height: { xs: "100%", sm: "100%" },
      display: "flex",
      flexDirection: { xs: "column", sm: "column" },
    },
    logoContainer: {
      pt: 2,
      pb: 1,
    },
    logo: {
      textAlign: "center",
      mb: 3,
      color: "#ffffff",
      fontWeight: 400,
      fontSize: { xs: "28px", sm: "36px" },
      fontFamily: "Comfortaa",
      lineHeight: { xs: "32px", sm: "40.14px" },
    },
    mainMenuText: {
      color: "#7b7b7b",
      ml: { xs: 1, sm: 1.875 },
      fontFamily: "Poppins",
      fontSize: { xs: "11px", sm: "12px" },
      fontWeight: 400,
      lineHeight: "15.75px",
      letterSpacing: "0.7px",
      textAlign: "left",
    },
    divider: { bgcolor: "#3d3d4e" },
  
    listContainer: { flex: 1, overflow: "auto" },
  
    listItem: {
      py: 1,
      bgcolor: (theme) => (theme.active ? "#ffffff" : "transparent"),
      color: (theme) => (theme.active ? "#2A2927" : "#FFFFFF"),
      "&:hover": {
        bgcolor: "#ffffff",
        color: "#2a2927",
        "& .MuiListItemText-primary": {
          color: "#2a2927",
        },
      },
      cursor: "pointer",
    },
    listItemText: {
      "& .MuiListItemText-primary": {
        fontFamily: "Poppins",
        fontSize: { xs: "11px", sm: "12px" },
        fontWeight: 400,
        lineHeight: "15.75px",
        letterSpacing: "0.7px",
        textAlign: "left",
      },
    },
    drawer: {
      display: (theme) => (theme.variant === "temporary" ? "block" : "none"),
      "@media (min-width: 600px)": {
        display: (theme) => (theme.variant === "permanent" ? "block" : "none"),
      },
      "& .MuiDrawer-paper": {
        boxSizing: "border-box",
        width: "235px", //  width: `${drawerWidth}px`,
        backgroundColor: "#2a2927",
        color: "#ffffff",
        borderRight: "none",
      },
    },
  });
  export default DrawerCss;
  