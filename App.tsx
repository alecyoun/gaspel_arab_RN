import React, { useState } from 'react';
import { View, Share } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageScreen from './components/ImageScreen.js';
import TitleList from './components/TitleList.js';
import SearchScreen from './components/SearchScreen.js';
import FavoritesScreen from './components/FavoritesScreen.js';
import SettingsScreen from './components/SettingsScreen.js';
import StatisticsScreen from './components/StatisticsScreen.js';
import RecentViewedScreen from './components/RecentViewedScreen.js';
import NoteEditorScreen from './components/NoteEditorScreen.js';
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

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleStatisticsPress = () => {
    navigation.navigate('Statistics');
  };

  const handleRecentViewedPress = () => {
    navigation.navigate('RecentViewed');
  };

  const handleSearchItemPress = (index) => {
    navigation.navigate('ImageScreen', { index });
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: 'Hosanna Hymnbook - 찬송가 앱을 확인해보세요!',
        title: 'Hosanna Hymnbook',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TitleList
        data={data}
        onTitlePress={(index) => navigation.navigate('ImageScreen', { index: index })}
        onSearchPress={handleSearchPress}
        onFavoritesPress={handleFavoritesPress}
        onSettingsPress={handleSettingsPress}
        onStatisticsPress={handleStatisticsPress}
        onRecentViewedPress={handleRecentViewedPress}
        onSharePress={handleSharePress}
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
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="RecentViewed"
          component={RecentViewedScreen}
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="NoteEditor"
          component={NoteEditorScreen}
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