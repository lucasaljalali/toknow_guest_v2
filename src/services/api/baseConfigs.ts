import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dev.totalexpansion.pt/devapi/v2/",
});

let pendingRequests = 0;

// Request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Increment the pendingRequests counter for each new request
    pendingRequests++;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Decrement the pendingRequests counter for each completed response
    pendingRequests--;
    return response;
  },
  function (error) {
    // Decrement the pendingRequests counter for each completed response, including errors
    pendingRequests--;

    const config = error.config;
    // Check if the error status code indicates a server issue (5xx) and if we haven't retried yet
    if (error.response && error.response.status >= 500 && error.config && error.config.__retry !== true) {
      config.__retry = true;
      // Retry the request up to 3 times with a delay between retries
      return new Promise((resolve) => {
        setTimeout(() => resolve(axiosInstance(config)), 1000); // You can adjust the delay as needed
      });
    }

    return Promise.reject(error);
  }
);

// Function to check if there are any pending requests
function hasPendingRequests() {
  return pendingRequests > 0;
}

export { axiosInstance, hasPendingRequests };
