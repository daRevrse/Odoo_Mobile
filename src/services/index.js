import api, {
  isAuthenticated,
  setAuthToken,
  logout,
  getSessionCookies,
  clearSessionCookies,
  initializeSession,
  STORAGE_KEYS,
  API_BASE_URL,
  ODOO_BASE_URL,
} from "./api";
import authService from "./authService";
import contactService from "./contactService";

export {
  api,
  authService,
  contactService,
  isAuthenticated,
  setAuthToken,
  logout,
  getSessionCookies,
  clearSessionCookies,
  initializeSession,
  STORAGE_KEYS,
  API_BASE_URL,
  ODOO_BASE_URL,
};
