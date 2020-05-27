import React, { useState } from "react";
import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
  Icon,
} from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import StarBorder from "@material-ui/icons/StarBorder";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
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
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const NavDrawer = (props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [openUsers, setOpenUsers] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);

  const users = [
    { id: 1, name: "Dave" },
    { id: 2, name: "Matt" },
    { id: 3, name: "Diane" },
  ];
  const fsRooms = useSelector((state) => state.firestore.ordered.rooms);
  const fsUsers = useSelector((state) => state.firestore.ordered.users);
  const auth = useSelector((state) => state.firebase.auth);

  useFirestoreConnect(() => [{ collection: "rooms" }]);
  useFirestoreConnect(() => [{ collection: "users" }]);

  const handleUserList = () => {
    setOpenUsers(!openUsers);
  };

  const handleRoomList = () => {
    setOpenRooms(!openRooms);
  };
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button onClick={handleRoomList}>
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary={"Rooms"} />
        </ListItem>
      </List>
      <Collapse in={openRooms} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            onClick={() =>
              props.handleModalOpen({
                title: "Skapa nytt rum",
                fields: [
                  { id: "title", icon: "local_offer", select: false },
                  {
                    id: "users",
                    select: true,
                    options: fsUsers.filter((user) => user.id !== auth.uid),
                  },
                ],
                buttons: [
                  {
                    text: "Lägg till",
                    type: "submit",
                    color: "primary",
                    abort: false,
                  },
                  {
                    text: "Avbryt",
                    type: "reset",
                    color: "secondary",
                    abort: true,
                  },
                ],
              })
            }
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<Icon>add</Icon>}
            >
              Skapa nytt
            </Button>
          </ListItem>
          {fsRooms &&
            fsRooms.map((room) => (
              <ListItem
                key={room.id}
                button
                className={classes.nested}
                onClick={() => props.toggleRoom(room)}
              >
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary={`#${room.title}`} />
              </ListItem>
            ))}
        </List>
      </Collapse>
      <Divider />
      <List>
        <ListItem button onClick={handleUserList}>
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary={"Users"} />
        </ListItem>
      </List>
      <Collapse in={openUsers} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            onClick={() =>
              props.handleModalOpen({
                title: "Ange ny användare",
                fields: [{ id: "email", icon: "email", select: false }],
                buttons: [
                  {
                    text: "Lägg till",
                    type: "submit",
                    color: "primary",
                    abort: false,
                  },
                  {
                    text: "Avbryt",
                    type: "reset",
                    color: "secondary",
                    abort: true,
                  },
                ],
              })
            }
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<Icon>add</Icon>}
            >
              Lägg till ny
            </Button>
          </ListItem>
          {users.map((user) => (
            <ListItem key={user.id} button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default NavDrawer;
