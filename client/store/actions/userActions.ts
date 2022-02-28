import axios from "axios";

import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../constants/userConstants";

export const login = (email: String, password: String) => async (dispatch: any) => {
  console.log("Logging in!")
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/users/login", { email, password }, config);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(data));
    }
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        (error as any).response && (error as any).response.data.message
          ? (error as any).response.data.message
          : (error as Error).message,
    });
  }
};

export const logout = () => (dispatch: any) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userInfo");
  }
  dispatch({ type: USER_LOGOUT });
  document.location.href = "/home";
};

export const register =
  (name: string, email: string, password: string) => async (dispatch: any) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/users", { name, email, password }, config);

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          (error as any).response && (error as any).response.data.message
            ? (error as any).response.data.message
            : (error as Error).message,
      });
    }
  };

export const getUserDetails = (id: number) => async (dispatch: any, getState: Function) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      (error as any).response && (error as any).response.data.message
        ? (error as any).response.data.message
        : (error as Error).message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};
