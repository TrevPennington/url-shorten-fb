import React, { useContext, useState, useEffect } from 'react'
const AuthContext = React.createContext()
const AuthFunctionsContext = React.createContext()
import auth from '@react-native-firebase/auth';

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const useAuthFunctionsContext = () => {
  return useContext(AuthFunctionsContext)
}

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  useEffect(() => {
   
    const authListener = auth().onAuthStateChanged((user) => {
      setAuthUser(user);
      setLoading(false);
    });
    return () => {
      authListener();
  }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser: authUser, loading: loading }}>
      <AuthFunctionsContext.Provider value={{ logout }}>
        {children}
      </AuthFunctionsContext.Provider>
    </AuthContext.Provider>
  )
}