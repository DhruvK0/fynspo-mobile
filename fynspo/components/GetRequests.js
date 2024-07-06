//Function to get all the requests from the database
export async function makeApiCall(image_string, metadata) {
    //write data to spreadsheet
    // const timestamp = new Date().toLocaleString();
    // writeToSheet([timestamp, 'test_user',  requestBody.image]);
  
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

    // formdata.append('sex', "M");
    // formdata.append('price_high', 100);
    
    // console.log("formdata", requestBody);
    const requestOptions = {
      method: "POST",
      body: formdata
    };
    
    try {
      const response = await fetch("https://al9bgznmmj.execute-api.us-east-1.amazonaws.com/fynspo", requestOptions);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      // console.error(error);
      throw error;  // Re-throw the error to be handled by the caller
    }
  }

export async function getSimilarItems(id, view, item_count = 20) {
  const formdata = new FormData();
  formdata.append("view", view);
  formdata.append("ID", id.toString());
  formdata.append("item_count", item_count.toString());


  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };
  try {
    const response = await fetch("https://al9bgznmmj.execute-api.us-east-1.amazonaws.com/similar_items", requestOptions)
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