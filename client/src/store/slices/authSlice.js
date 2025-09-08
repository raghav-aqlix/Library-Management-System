import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = false;
    },
    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetAuthSlice(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
    },
  },
});

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export const register = (data) => async (dispatch) => {
  dispatch(authSlice.actions.registerRequest());
  await axiosInstance
    .post("/auth/register", data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(authSlice.actions.registerSuccess(res.data));
    })
    .catch((error) => {
      dispatch(authSlice.actions.registerFailed(error.response.data.message));
    });
};

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  await axiosInstance
    .post("/auth/login", data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(authSlice.actions.loginSuccess(res.data));
      dispatch(getUser());
    })
    .catch((error) => {
      dispatch(authSlice.actions.loginFailed(error.response.data.message));
    });
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  await axiosInstance
    .get("/auth/logout")
    .then((res) => {
      dispatch(authSlice.actions.logoutSuccess(res.data.message));
      dispatch(authSlice.actions.resetAuthSlice());
    })
    .catch((error) => {
      dispatch(authSlice.actions.logoutFailed(error.response.data.message));
    });
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  await axiosInstance
    .get("/auth/me")
    .then((res) => {
      dispatch(authSlice.actions.getUserSuccess(res.data));
    })
    .catch(() => {
      dispatch(authSlice.actions.getUserFailed());
    });
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  await axiosInstance
    .put("/auth/password/update", data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.updatePasswordFailed(error.response.data.message)
      );
    });
};

export default authSlice.reducer;
