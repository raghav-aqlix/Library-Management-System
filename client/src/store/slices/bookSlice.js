import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllBooks = createAsyncThunk(
  "book/fetchAllBooks",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("Fetching all books...");
      const { data } = await axiosInstance.get("/book/all");
      // console.log("Books API response:", data);
      return data.books || [];
    } catch (error) {
      // console.error("Books API error:", error.response || error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addBook = createAsyncThunk(
  "book/addBook",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/book/admin/add", formData, {
        headers: { "Content-Type": "application/json" },
      });
      return data.book;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBook = createAsyncThunk(
  "book/updateBook",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/book/update/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      return data.book;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`/book/delete/${id}`);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetBookSlice: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.books = action.payload;
        } else if (
          action.payload?.books &&
          Array.isArray(action.payload.books)
        ) {
          state.books = action.payload.books;
        } else {
          state.books = [];
        }
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addBook.fulfilled, (state, action) => {
        state.message = "Book added successfully";
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateBook.fulfilled, (state, action) => {
        state.message = "Book updated successfully";
        state.books = state.books.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteBook.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.books = state.books.filter((b) => b._id !== action.payload.id);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetBookSlice } = bookSlice.actions;
export default bookSlice.reducer;
