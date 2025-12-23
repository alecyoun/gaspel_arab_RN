import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Image, Dimensions, Platform, View, Text, TouchableOpacity, Share, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import data from '../data';
import { FavoritesManager } from './FavoritesManager';
import { ViewedManager, NotesManager, BookmarksManager } from './SettingsManager';
// import MusicPlayer from './MusicPlayer'; // music 기능 비활성화

Ionicons.loadFont().then();

const { width, height } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
  const { index } = route.params;
  const [scales, setScales] = useState({}); // 각 슬라이드별 스케일 상태
  const [baseScales, setBaseScales] = useState({}); // 각 슬라이드별 기본 스케일
  const [currentIndex, setCurrentIndex] = useState(index);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasNote, setHasNote] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    checkFavorite();
    checkNote();
    checkBookmark();
    // 최근 본 항목에 추가
    ViewedManager.addViewed(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    // NoteEditor에서 돌아왔을 때 메모 상태 업데이트
    const unsubscribe = navigation.addListener('focus', () => {
      checkNote();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    checkBookmark();
  }, [currentPage, currentIndex]);

  const checkFavorite = async () => {
    const favorite = await FavoritesManager.isFavorite(currentIndex);
    setIsFavorite(favorite);
  };

  const checkNote = async () => {
    const note = await NotesManager.getNote(currentIndex);
    setHasNote(note.length > 0);
  };

  const checkBookmark = async () => {
    const bookmarked = await BookmarksManager.isBookmarked(currentIndex, currentPage);
    setIsBookmarked(bookmarked);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await FavoritesManager.removeFavorite(currentIndex);
    } else {
      await FavoritesManager.addFavorite(currentIndex);
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    try {
      const currentItem = data[currentIndex];
      await Share.share({
        message: `${currentItem.title}\n\nHosanna Hymnbook`,
        title: currentItem.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleNote = () => {
    navigation.navigate('NoteEditor', { index: currentIndex });
  };

  const toggleBookmark = async () => {
    if (isBookmarked) {
      await BookmarksManager.removeBookmark(currentIndex, currentPage);
    } else {
      await BookmarksManager.addBookmark(currentIndex, currentPage);
    }
    setIsBookmarked(!isBookmarked);
  };

  const getScale = useCallback((slideIndex) => {
    return scales[slideIndex] || 1;
  }, [scales]);

  const getBaseScale = useCallback((slideIndex) => {
    return baseScales[slideIndex] || 1;
  }, [baseScales]);

  const createPinchHandler = useCallback((slideIndex) => {
    const onPinchGestureEvent = ({ nativeEvent }) => {
      const baseScale = getBaseScale(slideIndex);
      const newScale = baseScale * nativeEvent.scale;
      if (newScale >= 1 && newScale <= 5) {
        setScales(prev => ({ ...prev, [slideIndex]: newScale }));
      }
    };

    const onPinchHandlerStateChange = ({ nativeEvent }) => {
      if (nativeEvent.state === State.END) {
        const currentScale = getScale(slideIndex);
        setBaseScales(prev => ({ ...prev, [slideIndex]: currentScale }));
      }
    };

    return { onPinchGestureEvent, onPinchHandlerStateChange };
  }, [getBaseScale, getScale]);

  const onIndexChanged = (newIndex) => {
    setCurrentIndex(newIndex);
    setCurrentPage(0);
  };

  const onPageChanged = (page) => {
    setCurrentPage(page);
  };

  const currentItem = data[currentIndex];

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={handleShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="share-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={handleNote}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon 
                name={hasNote ? "document-text" : "document-text-outline"} 
                size={28} 
                color={hasNote ? "#ff9500" : "#fff"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={toggleBookmark}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={28} 
                color={isBookmarked ? "#af52de" : "#fff"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={toggleFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={28} 
                color={isFavorite ? "#ff3b30" : "#fff"} 
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Swiper
            ref={swiperRef}
            showsPagination
            loop={false}
            index={index}
            onIndexChanged={onIndexChanged}
            onMomentumScrollEnd={(e, state) => onPageChanged(state.index)}
            containerStyle={styles.swiperContainer}
            removeClippedSubviews={Platform.OS === 'ios'}
            loadMinimal
            loadMinimalSize={2}
          >
            {data.map((item, i) => {
              const scale = getScale(i);
              const { onPinchGestureEvent, onPinchHandlerStateChange } = createPinchHandler(i);
              
              return (
                <PinchGestureHandler
                  key={i}
                  onGestureEvent={onPinchGestureEvent}
                  onHandlerStateChange={onPinchHandlerStateChange}
                  minPointers={2}
                  avgTouches
                >
                  <View style={styles.slide}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={item.image}
                        style={[
                          styles.image,
                          {
                            transform: [{ scale: scale }],
                          }
                        ]}
                        resizeMode="contain"
                        fadeDuration={0}
                        progressiveRenderingEnabled={Platform.OS === 'ios'}
                      />
                    </View>
                  </View>
                </PinchGestureHandler>
              );
            })}
          </Swiper>
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>{currentItem.title}</Text>
          </View>
        </View>
        {/* {currentItem && currentItem.music && <MusicPlayer music={currentItem.music} />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 10,
  },
  imageContainer: {
    flex: 1,
  },
  swiperContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  bottom: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ImageScreen;