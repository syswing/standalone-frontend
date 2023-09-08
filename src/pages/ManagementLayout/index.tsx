import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  CssBaseline,
} from "@mui/material";
import { Link } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { managementMenu } from "../../routes/routes";
const drawerWidth = 240;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const LinkItem = ({ to, name, open, setHeaderName }) => {
  return (
    <Link
      style={{
        textDecoration: "none",
        color: "currentColor",
        width: "100%",
      }}
      to={to}
      onClick={() => setHeaderName(name)}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        ></ListItemIcon>
        <ListItemText primary={name} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </Link>
  );
};

export default () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const [headerName, setHeaderName] = useState("");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <ThemeProvider
          theme={createTheme({
            palette: {
              primary: {
                main: "rgba(255, 255, 255, 0.1)",
              },
            },
          })}
        >
          <AppBar position="fixed" open={open}>
            <Toolbar
              style={{
                backdropFilter: "blur(8px)",
                background: "rgba(255, 255, 255, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                position: "fixed",
                width: "100%",
                zIndex: "10",
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {headerName}
              </Typography>
            </Toolbar>
          </AppBar>
        </ThemeProvider>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Link
              style={{
                textDecoration: "none",
                color: "currentColor",
                width: "100%",
              }}
              to={"/articles"}
            >
              <Typography align="right" variant="h6" noWrap component="div">
                syswing
              </Typography>
            </Link>

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              {managementMenu.map((item) => {
                return (
                  <LinkItem
                    open={open}
                    setHeaderName={setHeaderName}
                    to={item.path}
                    name={item.title}
                    key={item.title}
                  />
                );
              })}
            </ListItem>
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Outlet />
        </Main>
        
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
            发布成功
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};
