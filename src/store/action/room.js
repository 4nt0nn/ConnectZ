import * as Types from "./types";

/**
 * Action creator for disptaching events regarding the creation of a room.
 *
 * @param {object} firestore - containing the firestore instance.
 * @param {object} room - containing the title of the room.
 */
export const tryToCreateRoom = (firestore, room) => {
  return (dispatch, getState) => {
    const user = getState().firebase.auth.uid;
    dispatch({ type: Types.TRY_TO_CREATE_ROOM });
    const roomToSave = {
      title: room.title,
      users: [...room.users, user],
    };
    try {
      firestore
        .collection("rooms")
        .add(roomToSave)
        .then(() => dispatch({ type: Types.SUCCEDED_TO_CREATE_ROOM }))
        .catch(() => dispatch({ type: Types.FAILED_TO_CREATE_ROOM }));
    } catch (e) {
      console.log(e);
    }
  };
};
