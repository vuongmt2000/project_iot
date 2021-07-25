import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Login from './Login';



const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName = "Login">
      <Stack.Screen name="Home" component={Home}  options = {{headerShown : false}}/>
      <Stack.Screen name="Login" component={Login} options = {{headerShown : false}} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
