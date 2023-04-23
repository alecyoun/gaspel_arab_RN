import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
//import data from './../data.js';
import { View, Text } from 'react-native';

const data = [
  // ...
  { title: 'مقدمة(English)', image: require('../assets/images/0.jpg'), music: require('../assets/music/0.jpg') },
  { title: 'مقدمة(Arabic)', image: require('../assets/images/1.jpg'), music: require('../assets/music/1.jpg') },
  { title: '1. إسم بتاو بركة يسو', image: require('../assets/images/001.jpg'), music: require('../assets/music/001.jpg') },
  { title: '476. Music lesson (11) كوردات الـجـيـتـار', image: require('../assets/images/476.jpg'), music: require('../assets/music/476.jpg') },
  { title: '477. Sudanese Hymnbook info', image: require('../assets/images/477.jpg'), music: require('../assets/music/477.jpg') },
];

const ImageScreen = ({ route }) => {

  console.log('Index:', route.params);
  
  const { index } = route.params;
  //const title = data[index].title;
  console.log('data:', data[0].title);
  
  //const images = data[index].image;

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{data[index].title}</Text>
      <Swiper showsButtons loop={false} style={styles.wrapper}>
        {images.map((item, index) => (
          <View style={styles.slide} key={index}>
            <Image source={data[index].image} style={styles.image} resizeMode="contain" />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageScreen;
