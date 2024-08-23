import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://mock-apis-fex9.onrender.com';
const LIVE_API_URL = 'https://backend-server-8doz.onrender.com';

export const FetchService = {
  getTrendingItems: async (page = 1, filters = {}) => {
    try {
      const savedFilters = await AsyncStorage.getItem('filters');
      const appliedFilters = savedFilters ? JSON.parse(savedFilters) : filters;

      const queryParams = new URLSearchParams({
        page,
        ...appliedFilters,
      }).toString();

      const response = await fetch(`${BASE_URL}/get_trending_items`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trending items:', error);
      throw error;
    }
  },

  getSavedItems: async (page = 1) => {
    // Implement your API call here
    // This is a placeholder implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${page}-${i}`,
      image: 'https://example.com/image.jpg',
      brand: `Brand ${page}-${i}`,
      name: `Item ${page}-${i}`,
      price: Math.floor(Math.random() * 100) + 20,
    }));
  },

  // Add more API calls as needed
};

export const saveFilters = async (filters) => {
  try {
    await AsyncStorage.setItem('filters', JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
};

export const getFilters = async () => {
  try {
    const savedFilters = await AsyncStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : {};
  } catch (error) {
    console.error('Error getting filters:', error);
    return {};
  }
};

export const fetchPaymentSheetParams = async () => {
  const response = await fetch(`${LIVE_API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
  });
  const { paymentIntent, ephemeralKey, customer } = await response.json();

  return {
      paymentIntent,
      ephemeralKey,
      customer,
  }
};

export async function createUser(uid) {
  const data = { uid: uid };

  try {
    const response = await fetch(LIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}