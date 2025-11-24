import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageScreen from './components/ImageScreen.js';
import TitleList from './components/TitleList.js';
import data from './data.js';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <TitleList
        data={data}
        onTitlePress={(index) => navigation.navigate('ImageScreen', { index: index })}
      />
    </View>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
            options={{ title: 'Hosanna hymnbook' }}
        />
        <Stack.Screen
          name="ImageScreen"
          component={ImageScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;