import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleReturnBookPopup } from "./popUpSlice";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
  },
  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      // console.log("recordBookSuccess reducer fired:", action.payload);
      state.loading = false;
      state.message = action.payload || "Borrowed book recorded successfully.";
    },

    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  try {
    const res = await axios.get(
      "http://localhost:4000/api/v1/borrow/my-borrowed-books",
      {
        withCredentials: true,
      }
    );
    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksSuccess(res.data.borrowedBooks)
    );
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksFailed(
        err.response?.data?.message || "Error fetching borrowed books"
      )
    );
  }
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  try {
    const res = await axios.get(
      "http://localhost:4000/api/v1/borrow/borrowed-books-by-users",
      {
        withCredentials: true,
      }
    );
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks)
    );
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksFailed(
        err.response?.data?.message || "Error fetching borrowed books"
      )
    );
  }
};

export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  try {
    const res = await axios.post(
      `http://localhost:4000/api/v1/borrow/record-borrow-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    // console.log("recordBorrowBook res.data:", res.data);

    dispatch(
      borrowSlice.actions.recordBookSuccess(
        res.data.message || "Borrowed book recorded successfully."
      )
    );
  } catch (err) {
    dispatch(
      borrowSlice.actions.recordBookFailed(
        err.response?.data?.message || "Failed to borrow book"
      )
    );
  }
};

export const returnBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const res = await axios.put(
      `http://localhost:4000/api/v1/borrow/return-borrowed-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));

    dispatch(toggleReturnBookPopup());
  } catch (err) {
    dispatch(
      borrowSlice.actions.returnBookFailed(
        err.response?.data?.message || "Failed to return book"
      )
    );
  }
};

export const {
  fetchUserBorrowedBooksRequest,
  fetchUserBorrowedBooksSuccess,
  fetchUserBorrowedBooksFailed,
  recordBookRequest,
  recordBookSuccess,
  recordBookFailed,
  fetchAllBorrowedBooksRequest,
  fetchAllBorrowedBooksSuccess,
  fetchAllBorrowedBooksFailed,
  returnBookRequest,
  returnBookSuccess,
  returnBookFailed,
  resetBorrowSlice,
} = borrowSlice.actions;

export default borrowSlice.reducer;
