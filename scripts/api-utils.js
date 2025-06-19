/*
:::::::::::::::::::::::::::::::::::::::::::::::
 API POST/GET/PUT/PATH operations
 ::::::::::::::::::::::::::::::
*/

/*
 * Request function to perform fetch, based on the parameters
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {string} method - The method to make the API call.
 * @param {Object} headers - Optional headers for the request.
 * @params {Object} - Returns the response object from the API or an error object.

*/
async function request(url, method = 'GET', data = {}, headers = {}) {
  const options = {
    method,
    headers,
    redirect: 'follow',
  };

  if (data && method.toUpperCase() !== 'GET') {
    options.body = data;
  }
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = '';
      if (response.status === 400) errorMessage = 'Bad request! please try again.';
      if (response.status === 401) errorMessage = 'Unauthorized! please try again.';
      if (response.status === 403) errorMessage = 'Request failed! URL was forbidden, please try again.';
      if (response.status === 404) errorMessage = 'Request not found, please try again.';
      if (response.status === 422) errorMessage = 'Unprocess the request, please try again.';
      if (response.status === 500) errorMessage = 'Server error, unable to get the response.';
      throw new Error(errorMessage);
    }
    const apiResponse = await response.json();

    return { status: 'success', data: apiResponse };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 * Get data from a specified API endpoint with provided  headers.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 */
export async function getApiData(url, headers) {
  try {
    return await request(url, 'GET', {}, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
 * Sends a POST request to the specified API endpoint with provided data and headers.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 */

export async function postApiData(url, data, headers) {
  try {
    return await request(url, 'POST', data, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
::::::::::::::::::
 patch api data.. make use of the request function
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 :::::::::::::::::
 */
export async function patchApiData(url, data, headers) {
  try {
    return await request(url, 'PATCH', data, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
::::::::::::::::::
 put api data.. make use of the request function
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 :::::::::::::::::
 */
export async function putApiData(url, data, headers) {
  try {
    return await request(url, 'PUT', data, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
<<<<<<< HEAD
=======

// delete api data.. make use of the request function.....
export async function deleteApiData(url, headers) {
  try {
    return await request(url, 'DELETE', {}, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
>>>>>>> 33f864281d41745ca06c59fddfbff30915f59914
