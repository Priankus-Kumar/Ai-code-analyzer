import React, { createContext, useReducer, useEffect } from 'react';
import { authReducer, initialAuthState, AUTH_ACTIONS } from './authReducer.js';
import authService from '../../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthStatus() {
      try {
        const data = await authService.getMe();
        if (isMounted && data.user) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: data.user });
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: null });
        }
      }
    }

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ email, password }) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      const data = await authService.login({ email, password });
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.user });
      return data.user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: err.message });
      throw err;
    }
  };

  const register = async ({ name, email, password }) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      const data = await authService.register({ name, email, password });
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data.user });
      return data.user;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: err.message });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API call error:', err);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
