import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FavoritesManager } from './FavoritesManager';
import { ViewedManager } from './SettingsManager';
import { NotesManager } from './SettingsManager';
import { BookmarksManager } from './SettingsManager';
import data from '../data';

const StatisticsScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalHymns: data.length,
    favorites: 0,
    viewed: 0,
    notes: 0,
    bookmarks: 0,
  });

  useEffect(() => {
    loadStatistics();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadStatistics();
    });

    return unsubscribe;
  }, [navigation]);

  const loadStatistics = async () => {
    const favorites = await FavoritesManager.getFavorites();
    const viewed = await ViewedManager.getViewed(1000);
    const notes = await NotesManager.getAllNotes();
    const bookmarks = await BookmarksManager.getBookmarks();

    setStats({
      totalHymns: data.length,
      favorites: favorites.length,
      viewed: viewed.length,
      notes: Object.keys(notes).length,
      bookmarks: bookmarks.length,
    });
  };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={32} color={color} />
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإحصائيات</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard
            icon="musical-notes"
            label="إجمالي الترتيلات"
            value={stats.totalHymns}
            color="#007AFF"
          />
          <StatCard
            icon="heart"
            label="المفضلة"
            value={stats.favorites}
            color="#ff3b30"
          />
          <StatCard
            icon="eye"
            label="تمت مشاهدتها"
            value={stats.viewed}
            color="#34c759"
          />
          <StatCard
            icon="document-text"
            label="الملاحظات"
            value={stats.notes}
            color="#ff9500"
          />
          <StatCard
            icon="bookmark"
            label="الإشارات المرجعية"
            value={stats.bookmarks}
            color="#af52de"
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>التقدم</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(stats.viewed / stats.totalHymns) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((stats.viewed / stats.totalHymns) * 100)}% من الترتيلات تمت مشاهدتها
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statContent: {
    marginLeft: 16,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    writingDirection: 'rtl',
  },
  progressSection: {
    marginTop: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    writingDirection: 'rtl',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34c759',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default StatisticsScreen;





