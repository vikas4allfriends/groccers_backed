import React, { useState } from "react";
import { Typography, InputBase, Box, useTheme } from "@mui/material";
import SearchCss from "../../css/SearchCss";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const theme = useTheme();
  const styles = SearchCss(theme);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      console.log("Searching for:", query);
      // Example: You can call an API here to fetch search results based on the query
    }
  };
  return (
    <Box sx={styles.container}>
      <Typography variant="body2" sx={styles.searchLabel}>
        Search:
      </Typography>
      <Box sx={styles.searchBox}>
        <InputBase
          placeholder="EimpleLab"
          inputProps={{ "aria-label": "search organisations" }}
          sx={styles.searchInput}
          value={query}
          onChange={handleSearchChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearchSubmit();
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchBox;
