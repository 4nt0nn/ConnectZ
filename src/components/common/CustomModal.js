import React from "react";

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
} from "@material-ui/core";
import clsx from "clsx";

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomModal = (props) => {
  const classes = useStyles();
  const theme = useTheme();

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
          <form
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
                        {props.values.users.map((value) => (
                          <Chip
                            key={value.id}
                            label={value.name}
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
                        value={{ id: option.id, name: option.name }}
                        style={getStyles(
                          option.name,
                          props.values.users,
                          theme
                        )}
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
