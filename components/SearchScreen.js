import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-voice/voice';
import { RecentManager } from './FavoritesManager';

const SearchScreen = ({ visible, onClose, data, onItemPress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (visible) {
      loadRecentSearches();
      checkVoiceAvailability();
    }
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [visible]);

  // searchQuery가 변경될 때마다 검색 결과가 자동으로 업데이트되도록 보장
  // filteredData는 useMemo로 searchQuery에 의존하므로 자동으로 재계산됨
  // handleSearchTextChange에서 이미 forceUpdate를 트리거하므로 여기서는 추가 작업 불필요

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsRecording(true);
    };
    Voice.onSpeechEnd = () => {
      setIsRecording(false);
    };
    Voice.onSpeechError = (e) => {
      setIsRecording(false);
      console.error('Speech recognition error:', e);
      if (e.error?.code !== '7') { // 7은 사용자가 취소한 경우
        Alert.alert('오류', '음성 인식 중 오류가 발생했습니다.');
      }
    };
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const rawText = e.value[0];
        console.log('음성 인식 원본 결과:', rawText);
        // 음성 인식 결과 정리 (RTL 마커 등 제거)
        const cleanedText = cleanVoiceInput(rawText);
        console.log('정리된 음성 인식 결과:', cleanedText);
        // 음성 인식 완료 후 검색 쿼리 설정
        // handleSearchTextChange를 사용하여 키보드 입력과 동일한 방식으로 검색 실행
        handleSearchTextChange(cleanedText);
        console.log('검색 쿼리 설정 및 검색 실행됨:', cleanedText);
      }
      setIsRecording(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const checkVoiceAvailability = async () => {
    try {
      const available = await Voice.isAvailable();
      setIsAvailable(available);
    } catch (error) {
      console.error('Error checking voice availability:', error);
      setIsAvailable(false);
    }
  };

  const startVoiceSearch = async () => {
    try {
      await Voice.start('ar-SA'); // 아랍어(사우디아라비아)로 설정
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('오류', '음성 인식을 시작할 수 없습니다. 마이크 권한을 확인해주세요.');
    }
  };

  const stopVoiceSearch = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const loadRecentSearches = async () => {
    const recent = await RecentManager.getRecent(10);
    setRecentSearches(recent);
  };

  // 검색 텍스트 변경 핸들러 (키보드 입력과 음성 인식 모두에서 사용)
  const handleSearchTextChange = (text) => {
    setSearchQuery(text);
    // 검색 쿼리가 변경되면 filteredData가 자동으로 재계산됨
    // 강제로 리렌더링을 트리거하여 검색 결과가 표시되도록 함
    setForceUpdate(prev => prev + 1);
  };

  // 음성 인식 결과 정리 함수 (RTL 마커, 보이지 않는 문자 제거)
  const cleanVoiceInput = (text) => {
    if (!text) return '';
    return text
      .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // RTL/LTR 마커 제거
      .replace(/[\uFEFF]/g, '') // Zero-width no-break space 제거
      .trim();
  };

  // 제목에서 숫자 추출 함수
  const extractNumber = (text) => {
    if (!text) return null;
    const match = text.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // 아랍어 검색을 위한 정규화 함수
  const normalizeText = (text) => {
    if (!text) return '';
    // 아랍어 문자 정규화 (다양한 형태의 같은 문자를 통일)
    return text
      .normalize('NFD')
      .replace(/[\u064B-\u065F\u0670]/g, '') // 아랍어 발음 기호 제거
      .replace(/[\u0640]/g, '') // 타트윌 제거
      .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // RTL/LTR 마커 제거
      .replace(/[\uFEFF]/g, '') // Zero-width no-break space 제거
      .toLowerCase();
  };

  const filteredData = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.trim();
    const cleanedQuery = cleanVoiceInput(query);
    const normalizedQuery = normalizeText(cleanedQuery);
    
    // 숫자 검색을 위한 숫자 추출
    const queryNumber = extractNumber(cleanedQuery);
    
    console.log('검색 실행 - 쿼리:', cleanedQuery, '정규화된 쿼리:', normalizedQuery, '추출된 숫자:', queryNumber);
    
    const results = data
      .map((item, index) => ({ ...item, index }))
      .filter((item) => {
        // 숫자 검색: 쿼리가 숫자로 시작하면 제목의 숫자와 비교
        if (queryNumber !== null) {
          const titleNumber = extractNumber(item.title);
          if (titleNumber === queryNumber) {
            return true;
          }
        }
        
        // 텍스트 검색: 정규화된 검색 또는 원본 검색으로 매칭
        const normalizedTitle = normalizeText(item.title);
        const matches = normalizedTitle.includes(normalizedQuery) || item.title.includes(cleanedQuery);
        return matches;
      });
    console.log('검색 결과 개수:', results.length);
    return results;
  }, [searchQuery, data, forceUpdate]);

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
            onChangeText={handleSearchTextChange}
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
          {isAvailable && (
            <TouchableOpacity
              onPress={isRecording ? stopVoiceSearch : startVoiceSearch}
              style={styles.micButton}
            >
              <Icon 
                name={isRecording ? "mic" : "mic-outline"} 
                size={20} 
                color={isRecording ? "#ff3b30" : "#999"} 
              />
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
  micButton: {
    padding: 4,
    marginLeft: 4,
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
