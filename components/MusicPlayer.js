import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';

const MusicPlayer = ({ music }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const playMusic = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(music);
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
    }
  };

  return (
    <TouchableOpacity onPress={playMusic} style={{ position: 'absolute', bottom: 10, right: 10 }}>
      <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
    </TouchableOpacity>
  );
};

export default MusicPlayer;
