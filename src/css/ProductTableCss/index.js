const ProductTableCss = (theme) => ({
    tableContainer: {
      boxShadow: "0px 0px 4px 0px #00000040",
      marginBottom: theme.spacing(2),
      overflowX: "auto",
      "-webkit-overflow-scrolling": "touch", // For smooth scrolling on iOS
      "&::-webkit-scrollbar": {
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#efefef",
        //   backgroundColor: theme.palette.background.default,
      },
      "&::-webkit-scrollbar-thumb": {
        //   backgroundColor: theme.palette.primary.light,
        backgroundColor: "#000000",
        borderRadius: "4px",
      },
    },
    tableHeadRow: {
      backgroundColor: "#efefef",
      "& th": {
        fontWeight: 600,
      },
    },
    tableCellHeader: {
      padding: theme.spacing(1),
      color: theme.palette.text.primary,
      fontSize: "0.875rem",
      fontWeight: 600,
      borderBottom: `1px solid ${theme.palette.divider}`,
      whiteSpace: "nowrap",
    },
    tableRow: {
      "&:nth-of-type(even)": {
        backgroundColor: theme.palette.action.hover,
      },
      "&:hover": {
        backgroundColor: theme.palette.action.selected,
      },
    },
    tableCell: {
      padding: theme.spacing(1),
      fontSize: "0.875rem",
      whiteSpace: "nowrap",
    },
    avatar: {
      width: 30,
      height: 30,
    },
    loadMoreButton: {
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  
    statusTypography: {
      padding: theme.spacing(0.5, 1),
      borderRadius: theme.shape.borderRadius,
      display: "inline-block",
      fontSize: "0.875rem",
      fontWeight: 500,
      textAlign: "center",
      color: theme.palette.common.white, // Default text color
    },
    statusActive: {
      backgroundColor: "green",
    },
    statusDeactive: {
      backgroundColor: "red",
    },
  });
  
  export default ProductTableCss;
  