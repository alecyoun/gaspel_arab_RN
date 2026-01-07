import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@hosanna_settings';
const NOTES_KEY = '@hosanna_notes';
const BOOKMARKS_KEY = '@hosanna_bookmarks';
const VIEWED_KEY = '@hosanna_viewed';

// 기본 설정값
const DEFAULT_SETTINGS = {
  fontSize: 16,
  darkMode: false,
  theme: 'light',
};

export const SettingsManager = {
  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(newSettings) {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...newSettings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async resetSettings() {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error resetting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },
};

export const NotesManager = {
  async getNote(index) {
    try {
      const notes = await AsyncStorage.getItem(NOTES_KEY);
      const notesObj = notes ? JSON.parse(notes) : {};
      return notesObj[index] || '';
    } catch (error) {
      console.error('Error getting note:', error);
      return '';
    }
  },

  async saveNote(index, note) {
    try {
      const notes = await AsyncStorage.getItem(NOTES_KEY);
      const notesObj = notes ? JSON.parse(notes) : {};
      if (note.trim()) {
        notesObj[index] = note;
      } else {
        delete notesObj[index];
      }
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notesObj));
    } catch (error) {
      console.error('Error saving note:', error);
    }
  },

  async getAllNotes() {
    try {
      const notes = await AsyncStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : {};
    } catch (error) {
      console.error('Error getting all notes:', error);
      return {};
    }
  },

  async deleteNote(index) {
    try {
      const notes = await AsyncStorage.getItem(NOTES_KEY);
      const notesObj = notes ? JSON.parse(notes) : {};
      delete notesObj[index];
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notesObj));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  },
};

export const BookmarksManager = {
  async getBookmarks() {
    try {
      const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  async addBookmark(index, page = 0) {
    try {
      const bookmarks = await this.getBookmarks();
      const bookmark = { index, page, timestamp: Date.now() };
      const existing = bookmarks.findIndex(b => b.index === index && b.page === page);
      if (existing === -1) {
        bookmarks.push(bookmark);
        await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  },

  async removeBookmark(index, page) {
    try {
      const bookmarks = await this.getBookmarks();
      const updated = bookmarks.filter(b => !(b.index === index && b.page === page));
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  },

  async isBookmarked(index, page) {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(b => b.index === index && b.page === page);
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  },
};

export const ViewedManager = {
  async addViewed(index) {
    try {
      const viewed = await this.getViewed();
      const updated = [{ index, timestamp: Date.now() }, ...viewed.filter(v => v.index !== index)];
      await AsyncStorage.setItem(VIEWED_KEY, JSON.stringify(updated.slice(0, 50)));
    } catch (error) {
      console.error('Error adding viewed:', error);
    }
  },

  async getViewed(maxItems = 20) {
    try {
      const viewed = await AsyncStorage.getItem(VIEWED_KEY);
      return viewed ? JSON.parse(viewed).slice(0, maxItems) : [];
    } catch (error) {
      console.error('Error getting viewed:', error);
      return [];
    }
  },

  async clearViewed() {
    try {
      await AsyncStorage.removeItem(VIEWED_KEY);
    } catch (error) {
      console.error('Error clearing viewed:', error);
    }
  },
};





