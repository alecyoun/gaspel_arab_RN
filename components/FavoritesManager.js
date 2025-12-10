import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@hosanna_favorites';

export const FavoritesManager = {
  async getFavorites() {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async addFavorite(index) {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(index)) {
        favorites.push(index);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  async removeFavorite(index) {
    try {
      const favorites = await this.getFavorites();
      const updated = favorites.filter(fav => fav !== index);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  async isFavorite(index) {
    try {
      const favorites = await this.getFavorites();
      return favorites.includes(index);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },
};

const RECENT_KEY = '@hosanna_recent';

export const RecentManager = {
  async getRecent(maxItems = 10) {
    try {
      const recent = await AsyncStorage.getItem(RECENT_KEY);
      return recent ? JSON.parse(recent).slice(0, maxItems) : [];
    } catch (error) {
      console.error('Error getting recent:', error);
      return [];
    }
  },

  async addRecent(index) {
    try {
      const recent = await this.getRecent(20);
      const updated = [index, ...recent.filter(r => r !== index)];
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated.slice(0, 20)));
    } catch (error) {
      console.error('Error adding recent:', error);
    }
  },

  async clearRecent() {
    try {
      await AsyncStorage.removeItem(RECENT_KEY);
    } catch (error) {
      console.error('Error clearing recent:', error);
    }
  },
};




