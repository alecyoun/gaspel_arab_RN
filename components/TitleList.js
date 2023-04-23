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
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
  },
});

export default TitleList;
