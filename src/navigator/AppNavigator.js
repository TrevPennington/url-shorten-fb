import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuthContext } from '../context/AuthContext'
import { Home, Auth, Loading } from '../screens'

const Stack = createNativeStackNavigator()

export const AppNavigator = () => {
  const authContext = useAuthContext();
  const {authUser, user, loading} = authContext;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        { loading &&
          <Stack.Screen name="loading" component={Loading} />
        }
        { !authUser ?
          <Stack.Screen name="auth" component={Auth} />
          :
          <Stack.Screen name="home" component={Home} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}