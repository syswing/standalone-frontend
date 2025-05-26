import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const MobileNavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const routes = useSelector((state: any) => state.routesReducer.routes);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        style={{
          top: 'auto',
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.8)', // Glass effect
          backdropFilter: 'blur(10px)', // Blur effect
          boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
        }}
      >
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <List>
          {routes
            .filter((route: any) => !route.isDeleted)
            .map((route: any, index: number) => (
              <ListItem
                button
                key={index}
                onClick={() => handleNavigation(route.path)}
              >
                <ListItemText primary={route.name} />
              </ListItem>
            ))}
        </List>
      </Drawer>
    </>
  );
};

export default MobileNavBar;