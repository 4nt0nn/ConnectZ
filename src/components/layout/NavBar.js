import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Avatar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { tryToSignOut } from "../../store/action/authentication";
import { useFirebase } from "react-redux-firebase";

const drawerWidth = 240; // The drawer width needed for calculating the width of the appbar.

/**
 * Styling variable which calls a function
 * makeStyles that returns a object with
 * js syntax styling.
 */
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

/**
 * Functional component responsible for displaying
 * the navigation bar with searchbar, alerts icon
 * and profile settings dropdown.
 */
const NavBar = (props) => {
  const classes = useStyles(); // variable containing our style object.
  const dispatch = useDispatch(); // variable containing the dispatch function
  const firebase = useFirebase(); // variable containing our instance of frebase.
  const profile = useSelector((state) => state.firebase.profile); // Variable holding our profile object.
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element state used to set our anchor element.
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null); // Mobile anchor element state used to set our mobile anchor element.

  const isMenuOpen = Boolean(anchorEl); // Variable that returns true or false depending if there is an anchor element set.
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl); // Variable that returns true or false depending if there is a mobile anchor element.

  /**
   * Arrow function that handles setting the anchor element.
   * @param {object} event - Containing the event object.
   */
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Arrow function that handles closing the mobile menu
   * and sets the mobile anchor element to null.
   */
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  /**
   * Arrow function that handles closing the menu
   * and setting both the anchor element to null
   * and calling the function for closing the mobile menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  /**
   * Arrow function for handling openining the mobile menu
   * and setting the mobile anchor element to the current target of
   * the event.
   * @param {object} event - Containing the event object
   */
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  /**
   * Arrow function that binds the dispatch function
   * that calls tryToSignOut actions.
   */
  const boundHandleSignOut = () => dispatch(tryToSignOut(firebase));

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={boundHandleSignOut}>Sign out</MenuItem>
    </Menu>
  );
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt={profile.name} src={profile.imageUrl} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            ConnectZ
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar alt={profile.name} src={profile.imageUrl} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default NavBar;
