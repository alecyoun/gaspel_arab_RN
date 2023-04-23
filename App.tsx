import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ImageScreen from './components/ImageScreen.js';
import MusicPlayer from './components/MusicPlayer';
import TitleList from './components/TitleList.js';
import data from './data.js';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <TitleList
        data={data}
        onTitlePress={(title) => navigation.navigate('ImageList', { title, data })}
      />
    </View>
  );
};

const App = () => {
  const [currentMusic, setCurrentMusic] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Image"
          component={ImageScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      {currentMusic && <MusicPlayer music={currentMusic} />}
    </NavigationContainer>
  );
};

export default App
