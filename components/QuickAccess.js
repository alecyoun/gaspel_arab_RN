import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FavoritesManager, RecentManager } from './FavoritesManager';
import data from '../data';

const QuickAccess = ({ visible, onClose, onItemPress }) => {
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites', 'recent', 'number'
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [numberInput, setNumberInput] = useState('');

  useEffect(() => {
    if (visible) {
      loadFavorites();
      loadRecent();
    }
  }, [visible]);

  const loadFavorites = async () => {
    const favs = await FavoritesManager.getFavorites();
    setFavorites(favs);
  };

  const loadRecent = async () => {
    const recents = await RecentManager.getRecent();
    setRecent(recents);
  };

  const handleItemPress = (index) => {
    onItemPress(index);
    onClose();
  };

  const handleNumberGo = () => {
    const num = parseInt(numberInput);
    if (num >= 1 && num <= data.length) {
      handleItemPress(num - 1);
      setNumberInput('');
    }
  };

  const renderFavorites = () => (
    <FlatList
      data={favorites}
      keyExtractor={(item) => `fav-${item}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handleItemPress(item)}
        >
          <Icon name="heart" size={20} color="#ff3040" style={styles.icon} />
          <Text style={styles.listText}>{data[item]?.title || `ترتيلة ${item + 1}`}</Text>
          <Icon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>لا توجد مفضلات</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );

  const renderRecent = () => (
    <FlatList
      data={recent}
      keyExtractor={(item) => `recent-${item}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handleItemPress(item)}
        >
          <Icon name="time-outline" size={20} color="#007AFF" style={styles.icon} />
          <Text style={styles.listText}>{data[item]?.title || `ترتيلة ${item + 1}`}</Text>
          <Icon name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="time-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>لا توجد تراتيل مشاهدة مؤخراً</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );

  const renderNumberInput = () => (
    <View style={styles.numberContainer}>
      <Text style={styles.numberLabel}>الانتقال برقم الترتيلة</Text>
      <View style={styles.numberInputContainer}>
        <TextInput
          style={styles.numberInput}
          placeholder={`إدخال الرقم (1-${data.length})`}
          placeholderTextColor="#999"
          value={numberInput}
          onChangeText={setNumberInput}
          keyboardType="number-pad"
          returnKeyType="go"
          onSubmitEditing={handleNumberGo}
        />
        <TouchableOpacity
          style={styles.goButton}
          onPress={handleNumberGo}
          disabled={!numberInput || parseInt(numberInput) < 1 || parseInt(numberInput) > data.length}
        >
          <Text style={styles.goButtonText}>انتقال</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.numberHint}>يمكن إدخال من 1 إلى {data.length}</Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>الوصول السريع</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Icon name="heart" size={20} color={activeTab === 'favorites' ? '#ff3040' : '#999'} />
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
              المفضلة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
            onPress={() => setActiveTab('recent')}
          >
            <Icon name="time" size={20} color={activeTab === 'recent' ? '#007AFF' : '#999'} />
            <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
              المشاهدات الأخيرة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'number' && styles.activeTab]}
            onPress={() => setActiveTab('number')}
          >
            <Icon name="pricetag" size={20} color={activeTab === 'number' ? '#007AFF' : '#999'} />
            <Text style={[styles.tabText, activeTab === 'number' && styles.activeTabText]}>
              الانتقال بالرقم
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'recent' && renderRecent()}
          {activeTab === 'number' && renderNumberInput()}
        </View>
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    writingDirection: 'rtl',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  numberContainer: {
    padding: 20,
  },
  numberLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  numberInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  goButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  numberHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default QuickAccess;

