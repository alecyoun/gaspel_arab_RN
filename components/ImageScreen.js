import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Image, Dimensions, Platform, View, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import data from '../data';
// import MusicPlayer from './MusicPlayer'; // music 기능 비활성화

Ionicons.loadFont().then();

const { width, height } = Dimensions.get('window');

const ImageScreen = ({ route, navigation }) => {
  const { index } = route.params;
  const [scales, setScales] = useState({}); // 각 슬라이드별 스케일 상태
  const [baseScales, setBaseScales] = useState({}); // 각 슬라이드별 기본 스케일
  const [currentIndex, setCurrentIndex] = useState(index);
  const swiperRef = useRef(null);

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
        </View>
        <View style={styles.imageContainer}>
          <Swiper
            ref={swiperRef}
            showsPagination
            loop={false}
            index={index}
            onIndexChanged={onIndexChanged}
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
    right: 20,
    zIndex: 1,
  },
  closeButton: {
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