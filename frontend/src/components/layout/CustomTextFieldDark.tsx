import { forwardRef } from "react";
import {
  FormHelperText,
  TextField,
  TextFieldProps,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles<Theme>((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
      backgroundColor: "#000000",
      "&.Mui-focused": {
        backgroundColor: "#000000",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color: "#ffffff", // Cambiamos el texto a blanco
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#314c84",
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
    },
  },
  errorMessage: {
    color: theme.palette.error.main,
    maxWidth: "100%",
    marginTop: theme.spacing(2),
  },
}));

type CustomTextFieldProps = TextFieldProps & {
  errorMessage?: string;
};

const CustomTextFieldDark = forwardRef<HTMLInputElement, CustomTextFieldProps>(
  ({ errorMessage, ...props }, ref) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <TextField
          className={classes.textField}
          variant="outlined"
          fullWidth
          error={!!errorMessage}
          inputRef={ref}
          {...props}
        />
        {errorMessage && (
          <FormHelperText classes={{ root: classes.errorMessage }} error>
            {errorMessage}
          </FormHelperText>
        )}
      </div>
    );
  },
);

CustomTextFieldDark.displayName = "CustomTextFieldDark";

export default CustomTextFieldDark;
