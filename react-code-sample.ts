// NEXT JS application that was previously done. Code piece from a dynamic dropdown function. that can take a list of options with custom functions.
import React, { useState, MouseEvent } from "react";
import {
  Button,
  Grid,
  MenuProps,
  Menu,
  MenuItem,
  Typography,
  alpha,
  styled,
  Box,
  IconButton,
} from "@mui/material";

//Icon
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

type DropDownOption = {
  label: string;
  callback: (e) => void;
  icon?: any;
};

type DropDownSection = {
  heading?: string;
  icon?: any;
  options: DropDownOption[];
};

type DropDownProps = {
  label?: string;
  sections: DropDownSection[];
};

const DropDown = ({ label, sections }: DropDownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          background: "transparent",
          color: "black",
          "&:hover": { background: "transparent" },
          textTransform: "none",
        }}
      >
        {label}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
      >
        {sections &&
          sections.map((s, i) => (
            <Box key={i}>
              {s.icon && s.heading && (
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 15px",
                  }}
                >
                  <Typography
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "700",
                      fontSize: "12px",
                      lineHeight: "19px",
                      paddingTop: "4px",
                    }}
                  >
                    {s.heading}
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{
                      position: "relative",
                      left: "8px",
                      width: "25px",
                      height: "25px",
                    }}
                  >
                    {s.icon}
                  </IconButton>
                </Grid>
              )}
              {s.options.map((o, i) => {
                return (
                  <MenuItem
                    key={i}
                    onClick={o.callback}
                    disableRipple
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: "12px",
                      lineHeight: "19px",
                    }}
                  >
                    <Grid sx={{ width: "20px" }}> {o.icon}</Grid>
                    <Grid>{o.label}</Grid>
                  </MenuItem>
                );
              })}
            </Box>
          ))}
      </StyledMenu>
    </div>
  );
};

export { DropDown };
