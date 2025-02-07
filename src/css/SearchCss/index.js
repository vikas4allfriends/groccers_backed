const SearchCss = (theme) => ({
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      border: "1px solid #ffffff",
      // backgroundColor:"red"
  
    },
    searchLabel: {
      color: "#828690",
      marginRight: "10px",
      whiteSpace: "nowrap",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "18.38px",
      textAlign: "left",
    },
    searchBox: {
      display: "flex",
      alignItems: "center",
      minWidth:"200px",
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      boxShadow: "0px 0px 4px 0px #00000040",
      border: "1px solid #ffffff",
    },
    searchInput: {
      flex: 1,
      fontSize: "0.875rem",
      fontFamily: "Poppins",
      fontWeight: 400,
      width: "100%",
      "&::placeholder": {
        color: "#a2a2a2",
        opacity: 0.7,
      },
      "& .MuiInputBase-input": {
        padding: "6px 15px",
        width: "100%",
      },
    },
  });
  
  export default SearchCss;
  