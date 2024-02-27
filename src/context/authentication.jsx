import { createContext, useEffect, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";
import { fetchProfileData } from "../api/tmdbApis";
import { useDispatch } from "react-redux";
import {
  initializeProfileState,
  resetProfileState,
  setLoadingProfile,
} from "../store/profileQuery";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
});

export const AuthContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const getUserItems = async () => {
    dispatch(setLoadingProfile({ loading: true }));
    const result = await fetchProfileData(user);

    if (result && result?.tv && result?.movie) {
      dispatch(initializeProfileState({ tv: result.tv, movie: result.movie }));
    }

    dispatch(setLoadingProfile({ loading: false }));
  };
  const resetUserItems = async () => {
    dispatch(resetProfileState());
  };

  useEffect(() => {
    if (user) {
      getUserItems();
    } else {
      resetUserItems();
    }
  }, [user]);

  useEffect(() => {
    netlifyIdentity.on("login", (user) => {
      setUser(user);
      netlifyIdentity.close();
    });
    netlifyIdentity.on("logout", () => {
      setUser(null);
      netlifyIdentity.close();
    });

    netlifyIdentity.on("init", (user) => {
      setUser(user);
      setAuthReady(true);
    });

    netlifyIdentity.init();

    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
    };
  }, []);

  const login = () => {
    netlifyIdentity.open();
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const context = { user, login, logout, authReady };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
