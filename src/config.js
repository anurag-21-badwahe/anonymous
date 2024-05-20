const BASE_URL_DEV = "http://localhost:3000/"
const BASE_URL_PROD = "https://feedonymous.vercel.app/"
const MODE = process.env.NODE_ENV;
export const BASE_URL = MODE === "development" ? BASE_URL_DEV : BASE_URL_PROD;