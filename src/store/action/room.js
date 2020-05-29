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

/**
 * Action creator for disptaching events regarding adding users to a room.
 *
 * @param {object} firestore - containing the firestore instance.
 * @param {object} room - containing the title of the room.
 */
export const tryAddUserToRoom = (firestore, firebase, roomId, userList) => {
  return (dispatch, getState) => {
    dispatch({ type: Types.TRY_TO_ADD_ROOM_MEMBER });
    try {
      for (let i = 0; i <= userList.length; i++) {
        firestore
          .collection("rooms")
          .doc(roomId.toString())
          .update({
            users: firebase.firestore.FieldValue.arrayUnion(userList[i]),
          })
          .then(() => dispatch({ type: Types.SUCCEDED_TO_ADD_ROOM_MEMBER }))
          .catch(() => dispatch({ type: Types.FAILED_TO_ADD_ROOM_MEMBER }));
      }
    } catch (e) {
      console.log(e);
    }
  };
};

/**
 * Action creator for disptaching events regarding removing users from a room.
 *
 * @param {object} firestore - containing the firestore instance.
 * @param {object} room - containing the title of the room.
 */
export const tryRemoveUserFromRoom = (firestore, firebase, roomId, userId) => {
  return (dispatch, getState) => {
    dispatch({ type: Types.TRY_TO_REMOVE_ROOM_MEMBER });

    try {
      firestore
        .collection("rooms")
        .doc(roomId.toString())
        .update({
          users: firebase.firestore.FieldValue.arrayRemove(userId),
        })
        .then(() => dispatch({ type: Types.SUCCEDED_TO_REMOVE_ROOM_MEMBER }))
        .catch(() => dispatch({ type: Types.FAILED_TO_REMOVE_ROOM_MEMBER }));
    } catch (e) {
      console.log(e);
    }
  };
};
