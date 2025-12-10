import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RecentManager } from './FavoritesManager';

const SearchScreen = ({ visible, onClose, data, onItemPress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (visible) {
      loadRecentSearches();
    }
  }, [visible]);

  const loadRecentSearches = async () => {
    const recent = await RecentManager.getRecent(10);
    setRecentSearches(recent);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return data
      .map((item, index) => ({ ...item, index }))
      .filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery, data]);

  const handleItemPress = async (index) => {
    // 최근 검색 기록에 추가
    await RecentManager.addRecent(index);
    onItemPress(index);
    setSearchQuery('');
    onClose();
  };

  const handleRecentItemPress = async (index) => {
    // 최근 검색 기록에 추가 (맨 위로 이동)
    await RecentManager.addRecent(index);
    onItemPress(index);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>بحث</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="البحث عن عنوان الترتيلة..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {searchQuery.trim().length > 0 && (
          <View style={styles.resultsContainer}>
            {filteredData.length > 0 ? (
              <FlatList
                data={filteredData}
                keyExtractor={(item) => `search-${item.index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleItemPress(item.index)}
                  >
                    <Text style={styles.resultTitle}>{item.title}</Text>
                    <Icon name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="search-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>لا توجد نتائج بحث</Text>
                <Text style={styles.emptySubtext}>جرب كلمة بحث أخرى</Text>
              </View>
            )}
          </View>
        )}

        {searchQuery.trim().length === 0 && (
          <View style={styles.resultsContainer}>
            {recentSearches.length > 0 ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>البحث الأخير</Text>
                  <TouchableOpacity
                    onPress={async () => {
                      await RecentManager.clearRecent();
                      loadRecentSearches();
                    }}
                  >
                    <Text style={styles.clearText}>مسح الكل</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={recentSearches}
                  keyExtractor={(item) => `recent-${item}`}
                  renderItem={({ item: index }) => (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => handleRecentItemPress(index)}
                    >
                      <Icon name="time-outline" size={20} color="#999" style={styles.recentIcon} />
                      <Text style={styles.resultTitle}>{data[index]?.title || `Item ${index}`}</Text>
                      <Icon name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.listContent}
                />
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="search-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>ابحث عن الترتيلة</Text>
                <Text style={styles.emptySubtext}>يمكنك البحث بإدخال العنوان</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
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
  },
  closeButton: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    writingDirection: 'rtl',
  },
  clearText: {
    fontSize: 14,
    color: '#007AFF',
    writingDirection: 'rtl',
  },
  recentIcon: {
    marginRight: 8,
  },
});

export default SearchScreen;
