import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchScreen, WebViewScreen } from './src/screens';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="WebView" 
          component={WebViewScreen} 
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;