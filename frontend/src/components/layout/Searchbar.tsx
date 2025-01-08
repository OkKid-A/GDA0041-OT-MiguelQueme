import React from "react";
import { Box } from "@mui/material";
import CustomTextFieldDark from "./CustomTextFieldDark.tsx";

interface SearchbarProps {
  label: string;
  searchQuery: string | null;
  setSearchQuery: (query: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({
  label,
  searchQuery,
  setSearchQuery,
}) => {
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

  return (
    <Box sx={{ width: "60%", justifySelf: "center" }}>
      <CustomTextFieldDark
        label={label}
        value={searchQuery}
        onChange={handleSearch}
        id="reference"
      />
    </Box>
  );
};

export default Searchbar;
