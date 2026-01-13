import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Platform, Share, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const TitleList = ({ data, onTitlePress, onSearchPress, onFavoritesPress, onSettingsPress, onStatisticsPress, onRecentViewedPress, onSharePress }) => {
  const insets = useSafeAreaInsets();
  const safeAreaTop = (insets && typeof insets.top === 'number' && insets.top > 0) 
    ? insets.top 
    : (Platform.OS === 'ios' ? (isTablet ? 20 : 50) : 20);
  
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
        {data.map((item, index) => (
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 16 : 12,
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
  },
  container: {
    flexGrow: 1,
    padding: isTablet ? 20 : 10,
    paddingBottom: isTablet ? 40 : 20,
  },
  titleContainer: {
    width: '100%',
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 20 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#333',
    writingDirection: 'rtl',
  },
});

export default TitleList;
