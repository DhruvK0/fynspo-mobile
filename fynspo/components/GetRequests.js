//Function to get all the requests from the database
const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('image', uri);
    formData.append('type', 'base64');

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 57cdb951227d62f',
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // console.log('Upload successful:', data.data.link);
      // Here you can store the link or do further processing
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

export async function makeApiCall(image_string, metadata) {
    //write data to spreadsheet
    // const timestamp = new Date().toLocaleString();
    // writeToSheet([timestamp, 'test_user',  requestBody.image]);
    uploadImage(image_string);

    const formdata = new FormData();
    
    formdata.append('image', image_string); 
    if (metadata.fashionPreference != null && metadata.fashionPreference != 'B') {
      formdata.append('sex', metadata.fashionPreference);
    }
    if (metadata.priceRange) {
      formdata.append('price_low', metadata.priceRange[0]);
      formdata.append('price_high', metadata.priceRange[1]);
    }
    formdata.append('item_count', "20");

    const requestOptions = {
      method: "POST",
      body: formdata
    };
    
    try {
      const response = await fetch("https://al9bgznmmj.execute-api.us-east-1.amazonaws.com/fynspo", requestOptions);
      var result = await response.json();
      // console.log(result);
      for (let key in result) {
        if (!Array.isArray(result[key]) || result[key].length === 0 || !result[key].some(innerArray => innerArray.length > 0)) {
          delete result[key];
        }
      }
      return result;
    } catch (error) {
      // console.error(error);
      throw error;  // Re-throw the error to be handled by the caller
    }
  }

export async function getSimilarItems(id, view, item_count = 20, sex, price_low, price_high) {
  const formdata = new FormData();
  formdata.append("view", view);
  formdata.append("ID", id.toString());
  formdata.append("item_count", item_count.toString());
  formdata.append("sex", sex);
  formdata.append("price_high", price_high);
  formdata.append("price_low", price_low);


  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };
  try {
    const response = await fetch("https://al9bgznmmj.execute-api.us-east-1.amazonaws.com/similar_items", requestOptions)
    const result = await response.json();

    const filteredResult = await Promise.all(result.map(async (item) => {
      try {
        const imgResponse = await fetch(item.image);
        return imgResponse.ok ? item : null;
      } catch (error) {
        console.error(`Error checking image for item ${item.id}:`, error);
        return null;
      }
    }));

    // Remove null values (items with broken image links)
    const validItems = filteredResult.filter(item => item !== null);

    return validItems;
    // return result;
  } catch (error) {
    throw error;
  }
}

export async function getTrends(trend, limit = "15") {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  const query = `https://al9bgznmmj.execute-api.us-east-1.amazonaws.com/trend?trend=${trend}&limit=${limit}`;

  try {
    const response = await fetch(query, requestOptions);
    const result = await response.json();
    const formattedResult = result.map(([image, category, sex, data, id]) => ({
      image,
      category,
      sex,
      data: JSON.parse(data),
      id
    }));
    return formattedResult;
  } catch (error) {
    throw error;
  }
}

export async function getSexTrends(sex) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  const query = "https://al9bgznmmj.execute-api.us-east-1.amazonaws.com/sex_trends?sex=" + sex;

  try {
    const response = await fetch(query, requestOptions)
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export function encodeImage(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          if (reader.result) {
              resolve(reader.result.toString());
          } else {
              reject(new Error("Failed to read file"));
          }
      };
      reader.onerror = () => {
          reject(new Error("Error reading file"));
      };
      reader.readAsDataURL(file);
  });
}