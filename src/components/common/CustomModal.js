import React from "react";

import { useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Button,
  Fade,
  Backdrop,
  Modal,
  InputLabel,
  FormControl,
  Input,
  InputAdornment,
  Icon,
  Select,
  Chip,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  ListSubheader,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";

/**
 * Function for returning the styles object.
 */
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
  submitBtn: {
    display: "block",
    margin: "40px auto 10px auto",
  },
  margin: {
    display: "block",
    margin: 20,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  formControl: {
    minWidth: 214,
    maxWidth: 214,
  },
}));

/**
 * Function for returning the styles of our user chips.
 */
const getStyles = (name, users, theme) => {
  return {
    fontWeight:
      users.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const ITEM_HEIGHT = 48; // Select dropdown item heights.
const ITEM_PADDING_TOP = 8; // Select dropdown item padding.

// variable holding our properties for the select dropdown.
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/**
 * Functional component for returning our modal ui with form, fields and buttons.
 * @param {object} props - Containing our fields and buttons used for this modal/form.
 */
const CustomModal = (props) => {
  const classes = useStyles(); // variable containing our style object.
  const theme = useTheme(); // variable containing our theme object.
  const listIncluded = Boolean(props.itemList); // Used to check if a list is included in the props.
  const auth = useSelector((state) => state.firebase.auth); // variable containing our auth object from firebase
  return (
    <Modal
      aria-labelledby={"transition-modal-title"}
      aria-describedby={"transition-modal-description"}
      className={classes.modal}
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className={classes.paper}>
          <h2 id={"transition-modal-title"}>{props.title}</h2>
          {listIncluded ? (
            <List
              subheader={
                <ListSubheader component={"div"} id={"nested-list-subheader"}>
                  {props.itemList.length > 0 ? "" : props.itemListSubheader}
                </ListSubheader>
              }
            >
              {props.itemList.map((user) => (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar alt={user.name} src={user.imageUrl} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <ListItemSecondaryAction>
                    {user.id !== auth.uid ? (
                      <IconButton
                        onClick={() => props.boundRemoveMember(user.id)}
                        edge={"end"}
                        aria-label={"delete"}
                      >
                        <DeleteIcon color={"secondary"} />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            ""
          )}
          <form
            id={props.id}
            onSubmit={props.handleSubmit}
            className={classes.root}
            noValidate
            autoComplete={"off"}
          >
            {props.fields.map((field) => (
              <FormControl
                key={field.id}
                className={clsx(classes.margin, classes.textField)}
              >
                <InputLabel htmlFor={field.id}>
                  {field.id.toUpperCase()}
                </InputLabel>
                {field.select ? (
                  <Select
                    className={classes.formControl}
                    labelId={"mutiple-chip-label"}
                    id={"mutiple-chip"}
                    multiple
                    value={props.values.users}
                    onChange={props.handleChange(field.id)}
                    input={<Input id={"select-multiple-chip"} />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              props.users.find((user) => user.id === value).name
                            }
                            className={classes.chip}
                          />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {field.options.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        style={getStyles(option, props.values.users, theme)}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Input
                    id={field.id}
                    type={"text"}
                    value={props.values.id}
                    onChange={props.handleChange(field.id)}
                    endAdornment={
                      <InputAdornment position={"end"}>
                        <Icon>{field.icon}</Icon>
                      </InputAdornment>
                    }
                  />
                )}
              </FormControl>
            ))}
            {props.buttons.map((button) => (
              <Button
                onClick={button.abort ? props.handleClose : null}
                className={classes.submitBtn}
                variant={"contained"}
                color={button.color}
                type={button.type}
              >
                {button.text}
              </Button>
            ))}
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
