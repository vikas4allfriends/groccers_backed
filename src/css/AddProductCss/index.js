const AddOrganizationTheme = (theme) => ({
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minHeight: "100vh",
      padding: { xs: 1, sm: 0 },
    },
    navContainer: {
      display: "flex",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      justifyContent: "space-between",
      alignItems: {
        xs: "flex-start",
        sm: "center",
      },
  
      gap: { xs: 2, sm: 0 },
      mt: { xs: 0.5, sm: 1 },
      px: { xs: 1, sm: 2 },
      mb: 2.5,
  
      // background: "red",
    },
  
    headingBox: {
      display: "flex",
      flexDirection: {
        xs: "row",
        sm: "row",
      },
  
      alignItems: {
        xs: "flex-start",
        sm: "center",
      },
      width: {
        xs: "100%",
        sm: "auto",
      },
      gap: { xs: 1, sm: 2 },
    },
    backButton: {
      color: "#1c1b1f",
      padding: { xs: "4px", sm: "8px" },
      minWidth: { xs: "40px", sm: "auto" },
    },
    topHeading: {
      color: "#000000",
      fontFamily: "Poppins",
      fontSize: { xs: "18px", sm: "20px" },
      fontWeight: 500,
    },
    buttonBox: {
      display: "flex",
      gap: "8px",
      width: { xs: "100%", sm: "auto" },
      flexDirection: { xs: "column", sm: "row" },
    },
    actionButton: {
      mr: {
        xs: 0,
        sm: 1,
      },
      mb: {
        xs: 1,
        sm: 0,
      },
      width: {
        xs: "100%",
        sm: "auto",
      },
      color: "#2a2927",
      border: "1px solid #2a2927",
      minWidth: "50px",
      fontSize: "13px",
      fontWeight: 400,
      fontFamily: "Poppins",
  
      "&:hover": {
        bgcolor: "rgba(42, 41, 39, 0.04)",
        borderColor: "#2a2927",
      },
    },
  
    //  main content styles
  
    mainGrid: { height: "100%" },
  
    subGrid: {
      display: "flex",
      flexDirection: "column",
    },
    card: {
      boxShadow: "0px 0px 4px 0px #00000040",
      flexGrow: "1",
    },
    title: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#2A2927",
      fontFamily: "Inter",
    },
    subTitle: {
      mt: 1,
      fontSize: "16px",
      fontWeight: "500",
      color: "#2A2927",
      fontFamily: "Inter",
    },
    StyledTextField: {
      "& .MuiInputBase-root": {
        fontSize: "0.875rem",
      },
    },
  });
  
  export default AddOrganizationTheme;
  