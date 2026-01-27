import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const TitleList = ({ data, onTitlePress, onSearchPress, onFavoritesPress, onSettingsPress, onStatisticsPress, onRecentViewedPress, onSharePress }) => {
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => {
      subscription?.remove();
    };
  }, []);
  
  const safeAreaTop = (insets && typeof insets.top === 'number' && insets.top > 0) 
    ? insets.top 
    : (Platform.OS === 'ios' ? 50 : 20);
  
  return (
    <View style={styles.wrapper}>
      <View style={[styles.header, { paddingTop: safeAreaTop }]}>
        <View style={styles.headerButtons}>
          {onSharePress && (
            <TouchableOpacity
              onPress={onSharePress}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="share-social-outline" size={24} color="#333" />
            </TouchableOpacity>
          )}
          {onRecentViewedPress && (
            <TouchableOpacity
              onPress={onRecentViewedPress}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="time-outline" size={24} color="#333" />
            </TouchableOpacity>
          )}
          {onStatisticsPress && (
            <TouchableOpacity
              onPress={onStatisticsPress}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="stats-chart" size={24} color="#333" />
            </TouchableOpacity>
          )}
          {onFavoritesPress && (
            <TouchableOpacity
              onPress={onFavoritesPress}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="heart" size={24} color="#333" />
            </TouchableOpacity>
          )}
          {onSearchPress && (
            <TouchableOpacity
              onPress={onSearchPress}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="search" size={24} color="#333" />
            </TouchableOpacity>
          )}
          {onSettingsPress && (
            <TouchableOpacity
              onPress={onSettingsPress}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
      >
        {data && data.length > 0 && data.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => onTitlePress(index)}
            style={styles.titleContainer}
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 10,
  },
  titleContainer: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
    color: '#333',
  },
});

export default TitleList;
