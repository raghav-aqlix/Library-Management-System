import { createSlice } from "@reduxjs/toolkit";

const popUpSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addBookPopup: false,
    readBookPopup: false,
    recordBookPopup: false,
    returnBookPopup: false,
    addNewAdminPopup: false,
    editBookPopup: false,
  },
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },
    toggleRecordBookPopup(state) {
      state.recordBookPopup = !state.recordBookPopup;
    },
    toggleEditBookPopup: (state) => {
      state.editBookPopup = !state.editBookPopup;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    toggleReturnBookPopup(state) {
      // console.log("Toggling returnBookPopup:", !state.returnBookPopup);

      state.returnBookPopup = !state.returnBookPopup;
    },
    closeAllPopup(state) {
      state.addBookPopup = false;
      state.addNewAdminPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
      state.settingPopup = false;
      state.editBookPopup = false;
    },
  },
});

export const {
  closeAllPopup,
  toggleAddBookPopup,
  toggleAddNewAdminPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
  toggleEditBookPopup,
  toggleReturnBookPopup,
  toggleSettingPopup,
} = popUpSlice.actions;

export default popUpSlice.reducer;
