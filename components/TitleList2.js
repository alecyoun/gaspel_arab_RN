import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';

const TitleList = ({ data, onTitlePress }) => {
  return (
    <TouchableWithoutFeedback>
      <ScrollView contentContainerStyle={styles.container}>
        {data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => onTitlePress(index)}>
            <Text style={[styles.title, styles.rightAlign]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    ...Platform.select({
      ios: {
        textAlign: 'right',
      },
      android: {
        textAlign: 'right',
      },
    }),
  },
  rightAlign: {
    textAlign: 'right',
  },
});

export default TitleList;
