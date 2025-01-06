import React from "react";
import { TableCell, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles<Theme>((theme: Theme) => ({

  tableHeaderCell: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.text.secondary} !important`,
    fontWeight: "bold !important",
  },
}));

export interface TableHeader {
  label: string;
  align?: "left" | "center" | "right" | "justify" | undefined;
}

interface renderTableHeaderCellProps {
  cells: TableHeader[];
}

export const RenderTableHeaderCell: React.FC<renderTableHeaderCellProps> = ({
  cells,
}) => {
  const classes = useStyles();
  return (
    <>
      {cells.map((cell, index) => (
        <TableCell
            key={index}
            className={classes.tableHeaderCell}
          align={cell.align}
        >
          {cell.label}
        </TableCell>
      ))}
    </>
  );
};
