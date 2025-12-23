import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NotesManager } from './SettingsManager';
import data from '../data';

const NoteEditorScreen = ({ route, navigation }) => {
  const { index } = route.params;
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadNote();
  }, []);

  const loadNote = async () => {
    const loadedNote = await NotesManager.getNote(index);
    setNote(loadedNote);
  };

  const handleSave = async () => {
    await NotesManager.saveNote(index, note);
    setSaved(true);
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const currentItem = data[index];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ملاحظة</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{saved ? 'تم الحفظ' : 'حفظ'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentItem?.title || `Item ${index}`}</Text>
        </View>

        <TextInput
          style={styles.noteInput}
          placeholder="اكتب ملاحظتك هنا..."
          placeholderTextColor="#999"
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
          writingDirection="rtl"
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    writingDirection: 'rtl',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    writingDirection: 'rtl',
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 200,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    writingDirection: 'rtl',
  },
});

export default NoteEditorScreen;



