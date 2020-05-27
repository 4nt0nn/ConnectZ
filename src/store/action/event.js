import * as Types from "./types";

/**
 * Action creator for disptaching events regarding sending messages.
 *
 * @param {object} firestore - Containing the firestore instance.
 * @param {string} message - The actual message text.
 * @param {string} roomId - The id of the room the message is sent in.
 */
export const tryToSendMessage = (firebase, firestore, message, roomId) => {
  return (dispatch, getState) => {
    const user = getState().firebase.auth.uid;
    dispatch({ type: Types.TRY_TO_SEND_MESSAGE });
    const messageToSave = {
      content: message,
      user: user,
      sentAt: Date.now(),
    };
    try {
      firestore
        .collection("rooms")
        .doc(roomId)
        .collection("events")
        .doc("message")
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion(messageToSave),
        })
        .then(() => dispatch({ type: Types.SUCCEDED_TO_SEND_MESSAGE }))
        .catch(() => dispatch({ type: Types.FAILED_TO_SEND_MESSAGE }));
    } catch (e) {
      console.log(e);
    }
  };
};
