const loginTheme = (theme) => ({
    container: {
      height: { md: "100vh", xs: "100%" },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      px: { xs: 2, sm: 4, md: 6 },
      py: { xs: 4, md: 0 },
    },
    paperBox: {
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      width: "100%",
      maxWidth: "1100px",
      minHeight: { xs: "530px", md: "450px" },
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0px 0px 10px rgba(10, 10, 0, 0.2)",
      mx: { xs: 2, md: 0 },
      // marginTop: "40px",
    },
    // {/* Left Side - Login Form */}
  
    formBox: {
      flex: { xs: "1", md: "1.5" },
      p: { xs: 3, sm: 6, md: 6 },
      display: "flex",
      flexDirection: "column",
    },
    pageTitle: {
      fontSize: { xs: "24px", sm: "28px", md: "32px" },
      fontWeight: 600,
      color: "#1A1A1A",
      fontFamily: "Poppins",
      mb: 1,
    },
    pageSubtitle: {
      color: "#666",
      fontSize: { xs: "14px", sm: "16px" },
      mb: 3,
    },
    textField: {
      mb: 3,
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&:hover fieldset": {
          borderColor: "#2196F3",
        },
      },
    },
    linkBox: {
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "end",
      alignItems: { xs: "flex-start", sm: "center" },
      mb: 3,
    },
    link: {
      color: "#2196F3",
      textDecoration: "none",
      fontSize: "13px",
      fontFamily: "Inter",
      "&:hover": { textDecoration: "underline" },
    },
    button: {
      fontFamily: "Poppins",
      backgroundColor: "#2A2927",
      color: "white",
      textTransform: "none",
      py: 1.5,
      fontSize: "16px",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#4f4f4f",
      },
      "&:disabled": {
        backgroundColor: "#cccccc",
      },
    },
  
    // Vertical Divider
    divider: {
      display: { xs: "none", md: "block" },
      width: "2px",
      backgroundColor: "#E5E7EB",
    },
  
    // Right Side - Logo
  
    logoBox: {
      flex: { xs: "1", md: "1" },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: { xs: 6, md: 6 },
      backgroundColor: "#FAFAFA",
      borderTop: { xs: "1px solid #E5E7EB", md: "none" },
    },
    logo: {
      fontSize: { xs: "42px", sm: "52px", md: "64px" },
      fontWeight: 700,
      color: "#4f4f4f",
      textAlign: "center",
      fontFamily: "comfortaa",
    },
    // Footer
    footer: {
      mt: { xs: 4, md: 5 },
      color: "#666",
      fontSize: "14px",
      textAlign: "center",
    },
  });
  
  export default loginTheme;
  