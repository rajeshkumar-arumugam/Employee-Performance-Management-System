import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Logout,
  Palette,
  Dashboard,
  People,
  Assessment,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin, isHR, isManager } = useAuth();
  const { currentTheme, changeTheme, availableThemes } = useTheme();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeMenuOpen = (event) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    handleThemeMenuClose();
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Dashboard, roles: ['admin', 'hr', 'manager', 'employee'] },
    { label: 'Employees', path: '/employees', icon: People, roles: ['admin', 'hr', 'manager'] },
    { label: 'Goals', path: '/goals', icon: EmojiEvents, roles: ['admin', 'hr', 'manager', 'employee'] },
    { label: 'Reviews', path: '/reviews', icon: Assessment, roles: ['admin', 'hr', 'manager', 'employee'] },
  ];

  const visibleNavItems = navigationItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'hr': return 'warning';
      case 'manager': return 'info';
      default: return 'default';
    }
  };

  const getThemeDisplayName = (themeName) => {
    return themeName.charAt(0).toUpperCase() + themeName.slice(1);
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 0, 
            mr: 4,
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/dashboard')}
        >
          Employee Performance Management System
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Button
                key={item.path}
                color="inherit"
                startIcon={<Icon />}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        <IconButton
          color="inherit"
          onClick={handleThemeMenuOpen}
          sx={{ mr: 1 }}
        >
          <Palette />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Chip
              label={user?.role?.toUpperCase()}
              size="small"
              color={getRoleColor(user?.role)}
              variant="outlined"
            />
          </Box>
          
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={user?.profilePicture}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
            },
          }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={themeMenuAnchor}
          open={Boolean(themeMenuAnchor)}
          onClose={handleThemeMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 150,
            },
          }}
        >
          {availableThemes.map((themeName) => (
            <MenuItem
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              selected={currentTheme === themeName}
            >
              {getThemeDisplayName(themeName)}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;