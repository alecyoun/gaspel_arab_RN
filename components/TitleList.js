import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TitleList = ({ data, onTitlePress, onSearchPress, onFavoritesPress, onSettingsPress, onStatisticsPress, onRecentViewedPress }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hosanna hymnbook</Text>
        <View style={styles.headerButtons}>
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
      <TouchableWithoutFeedback>
        <ScrollView contentContainerStyle={styles.container}>
          {data.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => onTitlePress(index)}>
              <Text style={[styles.title, styles.rightAlign]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
  container: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
  },
});

export default TitleList;
