import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageScreen from './components/ImageScreen.js';
import TitleList from './components/TitleList.js';
import SearchScreen from './components/SearchScreen.js';
import FavoritesScreen from './components/FavoritesScreen.js';
import data from './data.js';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearchPress = () => {
    setSearchVisible(true);
  };

  const handleFavoritesPress = () => {
    navigation.navigate('Favorites');
  };

  const handleSearchItemPress = (index) => {
    navigation.navigate('ImageScreen', { index });
  };

  return (
    <View style={{ flex: 1 }}>
      <TitleList
        data={data}
        onTitlePress={(index) => navigation.navigate('ImageScreen', { index: index })}
        onSearchPress={handleSearchPress}
        onFavoritesPress={handleFavoritesPress}
      />
      <SearchScreen
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        data={data}
        onItemPress={handleSearchItemPress}
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
          options={{ 
            title: 'Hosanna hymnbook',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ImageScreen"
          component={ImageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;