import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { managementMenu } from "../../routes/routes";
import { clearAuth } from "../../request";
import useSnackbar from "components/SnackbarProvider/useSnackbar";

// Icons for menu items
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import TagIcon from "@mui/icons-material/Tag";
import ImageIcon from "@mui/icons-material/Image";
import RouteIcon from "@mui/icons-material/Route";
import CommentIcon from "@mui/icons-material/Comment";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const drawerWidth = 260;

// Main content area
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
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
  height: "100vh",
  overflow: "auto",
  backgroundColor: theme.palette.mode === "light" 
    ? "#f5f5f9" 
    : theme.palette.background.default,
  padding: theme.spacing(3),
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

// App bar
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
  boxShadow: "none",
  backdropFilter: "blur(8px)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === "light" 
    ? "rgba(255, 255, 255, 0.8)" 
    : "rgba(0, 0, 0, 0.6)",
  color: theme.palette.text.primary,
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

// Drawer header
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

// Get icon for menu item
const getMenuIcon = (title: string) => {
  switch (title) {
    case "日志管理":
      return <ArticleIcon />;
    case "标签管理":
      return <TagIcon />;
    case "图片管理":
      return <ImageIcon />;
    case "路由管理":
      return <RouteIcon />;
    case "评论管理":
      return <CommentIcon />;
    case "ocr":
      return <TextFormatIcon />;
    case "deepseek":
      return <SmartToyIcon />;
    default:
      return <DashboardIcon />;
  }
};

// Menu item component
const LinkItem = ({ to, name, open, setHeaderName, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
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
          borderRadius: "8px",
          mx: 1,
          mb: 0.5,
          backgroundColor: isActive ? "rgba(25, 118, 210, 0.08)" : "transparent",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.12)",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            color: isActive ? "primary.main" : "inherit",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText 
          primary={name} 
          sx={{ 
            opacity: open ? 1 : 0,
            "& .MuiTypography-root": {
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "primary.main" : "inherit",
            }
          }} 
        />
      </ListItemButton>
    </Link>
  );
};

export default () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [open, setOpen] = React.useState(!isMobile);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [headerName, setHeaderName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState<null | HTMLElement>(null);
  
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{"name": "Admin", "avatar": ""}');

  // Set header name based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenu = managementMenu.find(item => item.path === currentPath);
    if (currentMenu) {
      setHeaderName(currentMenu.title);
    } else if (currentPath.includes('/management/writeMd')) {
      setHeaderName('写日志');
    }
  }, [location.pathname]);

  // Handle drawer open/close
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Handle user menu open/close
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handle notifications menu open/close
  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  // Handle logout
  const handleLogout = () => {
    clearAuth();
    showSnackbar('已成功退出登录', 'success');
    navigate('/login');
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    // Here you would implement actual theme switching logic
  };

  // Create custom theme
  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#1c2536' : '#ffffff',
            boxShadow: darkMode ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {headerName}
            </Typography>
            
            {/* Theme toggle */}
            <IconButton color="inherit" onClick={handleThemeToggle} sx={{ ml: 1 }}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            {/* Notifications */}
            <IconButton color="inherit" onClick={handleOpenNotificationsMenu} sx={{ ml: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="notifications-menu"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
            >
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography variant="body2">新评论: "这篇文章很有帮助..."</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography variant="body2">系统通知: 备份已完成</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography variant="body2">安全提醒: 检测到新登录</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography variant="body2" color="primary">查看所有通知</Typography>
              </MenuItem>
            </Menu>
            
            {/* User menu */}
            <Box sx={{ ml: 2 }}>
              <Tooltip title="打开设置">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    alt={userInfo.name} 
                    src={userInfo.avatar || ''} 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {!userInfo.avatar && userInfo.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">个人资料</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">设置</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">退出登录</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
            },
          }}
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>A</Avatar>
              <Typography variant="h6" noWrap component="div">
                {userInfo.name}
              </Typography>
            </Box>
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
                    icon={getMenuIcon(item.title)}
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
          open={openSnack}
          autoHideDuration={6000}
          onClose={() => {
            setOpenSnack(false);
          }}
        >
          <Alert onClose={() => setOpenSnack(false)} severity="success" sx={{ width: '100%' }}>
            发布成功
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};
