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
import { FavoritesManager } from './FavoritesManager';
import data from '../data';

const FavoritesScreen = ({ navigation, onItemPress }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
    
    // 화면 포커스 시마다 즐겨찾기 목록 새로고침
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const favs = await FavoritesManager.getFavorites();
    setFavorites(favs);
  };

  const handleItemPress = (index) => {
    if (onItemPress) {
      onItemPress(index);
    } else if (navigation) {
      navigation.navigate('ImageScreen', { index });
    }
  };

  const handleRemoveFavorite = async (index) => {
    await FavoritesManager.removeFavorite(index);
    loadFavorites();
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>المفضلة</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>لا توجد عناصر مفضلة</Text>
          <Text style={styles.emptySubtext}>أضف عناصر إلى المفضلة من شاشة العرض</Text>
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
        <Text style={styles.headerTitle}>المفضلة ({favorites.length})</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => `fav-${item}`}
        renderItem={({ item: index }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleItemPress(index)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{data[index]?.title || `Item ${index}`}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveFavorite(index)}
                style={styles.removeButton}
              >
                <Icon name="heart" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </View>
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
  listContent: {
    paddingBottom: 20,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  removeButton: {
    padding: 8,
    marginLeft: 12,
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

export default FavoritesScreen;

