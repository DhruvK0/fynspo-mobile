//Function to get all the requests from the database
export async function makeApiCall(requestBody) {
    //write data to spreadsheet
    // const timestamp = new Date().toLocaleString();
    // writeToSheet([timestamp, 'test_user',  requestBody.image]);
  
    const formdata = new FormData();
    formdata.append('image', requestBody);
    
    const requestOptions = {
      method: "POST",
      body: formdata
    };
    
    try {
      const response = await fetch("https://al9bgznmmj.execute-api.us-east-1.amazonaws.com", requestOptions);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;  // Re-throw the error to be handled by the caller
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