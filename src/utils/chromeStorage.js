// Utility to handle Chrome storage with fallback for development
const storage = {
  local: {
    get: (keys, callback) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(keys, callback);
      } else {
        // Fallback to localStorage in development
        const result = {};
        keys.forEach((key) => {
          result[key] = localStorage.getItem(key) || "";
        });
        callback(result);
      }
    },
    set: (items, callback)  => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set(items, callback);
      } else {
        // Fallback to localStorage in development
        Object.entries(items).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
        if (callback) callback();
      }
    },
  },
};

export default storage;
