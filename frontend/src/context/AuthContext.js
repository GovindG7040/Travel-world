// frontend/src/context/AuthContext.jsx
import { createContext, useEffect, useReducer } from "react";

// Try to load user from localStorage on first load
let storedUser = null;
try {
  const raw = localStorage.getItem("user");
  storedUser = raw ? JSON.parse(raw) : null;
} catch (e) {
  storedUser = null;
}

const initial_state = {
  user: storedUser,   // <-- persists across refresh
  loading: false,
  error: null,
};

export const AuthContext = createContext(initial_state);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      // user will also be saved by useEffect
      return {
        user: action.payload,
        loading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };

    case "REGISTER_SUCCESS":
      return {
        user: null,
        loading: false,
        error: null,
      };

    case "LOGOUT":
      // clear storage on logout
      localStorage.removeItem("user");
      return {
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  // whenever user changes, sync to localStorage
  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem("user", JSON.stringify(state.user));
      } else {
        // if user is null, make sure we clear it
        localStorage.removeItem("user");
      }
    } catch (e) {
      console.error("Failed to sync user to localStorage:", e);
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
