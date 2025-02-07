const ProductCss = (theme) => ({
    containerBox: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100vh",
    },
  
    headingBox: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "stretch", md: "center" },
      gap: { xs: 2, md: 0 },
      mb: { xs: 3, md: 2 },
      position: "relative",
      zIndex: 1,
      mt: 1,
      px: 2,
  
      // background: "red",
    },
    pageTitle: {
      // fontWeight: theme.components.fontWeight.secondary,
      fontSize: "20px",
      fontFamily: "poppins",
      // color: theme.components.palette.primary.main,
      mb: { xs: 2, md: 0 },
    },
    actionBox: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "stretch", sm: "center" },
      gap: { xs: 2, sm: 2 },
      width: { xs: "100%", sm: "auto" },
    },
    addButton: {
      mr: { xs: 0, sm: 1 },
      mb: { xs: 2, sm: 0 },
      color: "#383838",
      border: "1px solid #383838",
      "&:hover": {
        backgroundColor: "rgba(42, 41, 39, 0.04)",
        borderColor: "#383838",
      },
      width: { xs: "100%", sm: "auto" },
      minWidth: { xs: "100%", sm: "160px" },
      height: "40px",
      fontFamily: "Poppins",
      fontSize: "14px",
      // fontWeight: theme.components.fontWeight.primary,
      letterSpacing: "0.5px",
    },
  });
  
  export default ProductCss;
  