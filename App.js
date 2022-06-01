import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigator/AppNavigator';
import { AuthProvider } from './src/context/AuthContext'

const App= () => {

  return (    
    <AuthProvider>
      <StatusBar barStyle='light-content' />
      <AppNavigator>
      </AppNavigator>
    </AuthProvider>
  );
};

export default App;