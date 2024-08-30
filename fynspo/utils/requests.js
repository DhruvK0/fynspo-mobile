import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://mock-apis-fex9.onrender.com';
const LIVE_API_URL = 'https://fynspo-backend.onrender.com';

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


export async function getTrendingItems()  {
  try {
    const response = await fetch(`${LIVE_API_URL}/get_trending_items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('There was a problem with the fetch operation in getting trending items:', error);
  }
}

export async function createUser(uid) {
  const data = { uid: uid };

  try {
    const response = await fetch(`${LIVE_API_URL}/create_user`, {
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
    console.log('User created:', result);
    return result;
  } catch (error) {
    console.error('There was a problem with the createUser fetch operation:', error);
  }
}

export async function userInteraction(uid, fynspo_id, interaction_type, duration) {
  const data = { uid: uid, fynspo_id: fynspo_id, interaction_type: interaction_type, duration: duration };

  try {
    const response = await fetch(`${LIVE_API_URL}/user_interaction`, {
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
    console.log('User interaction recorded:', result);
  } catch (error) {
    console.error('There was a problem with the user interaction fetch operation:', error);
  }
}

export async function getUserRecs(uid, category, sex, id_list, collection, collection_category, brand) {
  //only include the values that are not null
  const data = { uid: uid, category: category, sex: sex, id_list: id_list, collection: collection, collection_category: collection_category, brand: brand};

  try {
    const response = await fetch(`${LIVE_API_URL}/get_user_recs`, {
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
    console.error('There was a problem with the fetch operation in getting user recs:', error);
  }
}

export async function getSimilarItems(fynspo_id, sex) {
  const data = { fynspo_id: fynspo_id, sex: sex };

  try {
    
    const response = await fetch(`${LIVE_API_URL}/get_similar_items`, {
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
    console.error('There was a problem with the similar items fetch operation:', error);
  }
}

export async function search(query, id_list, sex) {
  const data = { query: query, id_list: id_list, sex: sex };

  try {
    const response = await fetch(`${LIVE_API_URL}/search`, {
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
    console.error('There was a problem with the search fetch operation:', error);
  }
}

export async function getCollections(collection) {
  const data = { collection: collection };

  try {
    const response = await fetch(`${LIVE_API_URL}/get_collections`, {
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
    console.error('There was a problem with the fetch operation in getting collections:', error);
  }
}

export async function getShippingInformation(brand_list) {
  const data = { brand_list: brand_list };

  try {
    const response = await fetch(`${LIVE_API_URL}/get_shipping_info`, {
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
    console.error('There was a problem with the fetch operation in getting shipping information:', error);
  }
}