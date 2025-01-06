import { makeStyles } from "@mui/styles";
import theme from "./theme.tsx";

export const useStylesFormSelect = makeStyles(() => {
  return {
    select: {
      marginTop: theme.spacing(2),
      "& .MuiOutlinedInput-root": {
        "&:hover": {
          borderColor: theme.palette.primary.main,
        },
        backgroundColor: theme.palette.info.dark,
        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      },
      "& .MuiInputLabel-root": {
        color: "#ffffff",
        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#314c84",
      },
      "& .MuiSelect-select": {
        color: theme.palette.text.primary,
      },
    },
    inputLabel: {
      color: `${theme.palette.text.primary} !important`,
      "&.Mui-focused": { color: theme.palette.primary.dark },
    },
    formHelperText: { color: theme.palette.error.main },
  };
});
