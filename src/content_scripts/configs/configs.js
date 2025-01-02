import sites from "./stack_sites.json";

// Constants - make RPC_NODE let instead of const to allow updates
let RPC_NODE = "https://base-sepolia-rpc.publicnode.com";
const APP_URL = "https://app.stackpoints.app";

// Question/Answer type mapping
const CONTENT_TYPES = {
  QUESTION: 1,
  ANSWER: 2
};

/**
 * Transforms array of sites into a map with site_url as key
 * @returns {Object} Map of site data indexed by URL
 */
const createSitesMap = () => {
  return sites.reduce((acc, site) => ({
    ...acc,
    [site.site_url]: site
  }), {});
};

/**
 * Cache the sites map to avoid recreating on every call
 */
const sitesMap = createSitesMap();

const config = {
  /**
   * Get mapping of site URLs to site data
   * @returns {Object} Map of site data
   */
  getSitesData() {
    return sitesMap;
  },

  /**
   * Get mapping of content types
   * @returns {Object} Map of content types
   */
  getContentTypes() {
    return {
      q: CONTENT_TYPES.QUESTION,
      a: CONTENT_TYPES.ANSWER
    };
  },

  /**
   * Get RPC node URL
   * @returns {string} RPC node URL
   */
  get rpcNode() {
    return RPC_NODE;
  },

  /**
   * Set RPC node URL
   * @param {string} url - New RPC node URL
   */
  set rpcNode(url) {
    if (typeof url !== 'string') {
      throw new Error('RPC node URL must be a string');
    }
    RPC_NODE = url;
  },

  /**
   * Get app URL
   * @returns {string} App URL
   */
  get appUrl() {
    return APP_URL;
  }
};

export const { getSitesData, getContentTypes } = config;
export const getRpcNode = () => config.rpcNode;
export const setRpcNode = (url) => { config.rpcNode = url; };
export const appUrl = config.appUrl;

// Export content types separately for direct use
export { CONTENT_TYPES };