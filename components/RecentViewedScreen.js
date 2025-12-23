import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ViewedManager } from './SettingsManager';
import data from '../data';

const RecentViewedScreen = ({ navigation, onItemPress }) => {
  const [recentViewed, setRecentViewed] = useState([]);

  useEffect(() => {
    loadRecentViewed();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecentViewed();
    });

    return unsubscribe;
  }, [navigation]);

  const loadRecentViewed = async () => {
    const viewed = await ViewedManager.getViewed(50);
    setRecentViewed(viewed);
  };

  const handleItemPress = (index) => {
    if (onItemPress) {
      onItemPress(index);
    } else if (navigation) {
      navigation.navigate('ImageScreen', { index });
    }
  };

  const handleClear = async () => {
    await ViewedManager.clearViewed();
    loadRecentViewed();
  };

  if (recentViewed.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>المشاهدات الأخيرة</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="time-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>لا توجد مشاهدات حديثة</Text>
          <Text style={styles.emptySubtext}>ستظهر الترتيلات التي تشاهدها هنا</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>المشاهدات الأخيرة ({recentViewed.length})</Text>
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearText}>مسح</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={recentViewed}
        keyExtractor={(item, idx) => `viewed-${item.index}-${idx}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleItemPress(item.index)}
          >
            <Icon name="time-outline" size={20} color="#999" style={styles.timeIcon} />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{data[item.index]?.title || `Item ${item.index}`}</Text>
              <Text style={styles.itemTime}>
                {new Date(item.timestamp).toLocaleDateString('ar', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    writingDirection: 'rtl',
  },
  placeholder: {
    width: 44,
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#007AFF',
    writingDirection: 'rtl',
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeIcon: {
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  itemTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default RecentViewedScreen;



