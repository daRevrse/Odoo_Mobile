import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConfigService from "./apiConfigService";

// ✅ MODIFICATION : URL dynamique au lieu d'URL fixe
let API_BASE_URL = "";
let ODOO_BASE_URL = "";

// Initialiser les URLs depuis le stockage
const initializeApiUrls = async () => {
  const storedUrl = await apiConfigService.getApiUrl();

  if (storedUrl) {
    ODOO_BASE_URL = storedUrl;
    API_BASE_URL = `${storedUrl}/bs_mobile_api`;
    console.log("📡 API URL initialisée:", ODOO_BASE_URL);
  }
};

// Initialiser au chargement du module
initializeApiUrls();

// Export des URLs (avec getters pour toujours avoir la valeur actuelle)
export const getApiBaseUrl = () => API_BASE_URL;
export const getOdooBaseUrl = () => ODOO_BASE_URL;

// Pour la compatibilité avec le code existant
export { API_BASE_URL, ODOO_BASE_URL };

// Clés de stockage
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
  DATABASE: "database",
};

// Store pour les cookies de session
let sessionCookies = "";

// ✅ MODIFICATION : Créer l'instance Axios avec URL dynamique
const createApiInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL || undefined, // Ne pas définir de baseURL par défaut
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};

let api = createApiInstance();

// ✅ NOUVEAU : Fonction pour mettre à jour l'API instance avec nouvelle URL
export const updateApiUrls = async () => {
  await initializeApiUrls();
  api = createApiInstance();
  console.log("🔄 Instance API mise à jour avec nouvelle URL");
};

// Intercepteur de requête pour ajouter le token d'authentification et les cookies
api.interceptors.request.use(
  async (config) => {
    try {
      // ✅ MODIFICATION : Récupérer l'URL actuelle avant chaque requête
      const currentUrl = await apiConfigService.getApiUrl();

      // Si pas de baseURL dans la config OU si c'est localhost, utiliser l'URL dynamique
      if (!config.baseURL || config.baseURL.includes('localhost')) {
        if (currentUrl) {
          config.baseURL = `${currentUrl}/bs_mobile_api`;
          console.log("🔄 BaseURL dynamique appliquée:", config.baseURL);
        } else {
          console.error("❌ URL API non configurée - la requête risque d'échouer");
        }
      }

      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Ajouter les cookies de session s'ils existent
      if (sessionCookies) {
        config.headers.Cookie = sessionCookies;
      }

      // 📝 LOG: Détails de la requête
      console.log("📤 API REQUEST:", {
        method: config.method?.toUpperCase(),
        baseURL: config.baseURL,
        url: config.url,
        fullURL: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
        hasToken: !!token,
        hasCookies: !!sessionCookies,
        headers: {
          Authorization: config.headers.Authorization ? "Bearer ***" : "None",
          Cookie: sessionCookies ? sessionCookies.substring(0, 50) + "..." : "None",
        },
      });

      return config;
    } catch (error) {
      console.error("❌ Erreur lors de la configuration de la requête:", error);
      return config;
    }
  },
  (error) => {
    console.error("❌ Erreur intercepteur request:", error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs et capturer les cookies
api.interceptors.response.use(
  (response) => {
    // 📝 LOG: Réponse reçue
    console.log("📥 API RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
    });

    // Capturer les cookies de la réponse
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      // Extraire et stocker les cookies
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      // Parser et stocker les cookies
      const cookieStrings = cookies.map((cookie) => {
        // Extraire seulement la partie "nom=valeur" sans les attributs
        const cookieParts = cookie.split(";")[0];
        return cookieParts;
      });

      sessionCookies = cookieStrings.join("; ");
      console.log("🍪 Cookies de session capturés:", sessionCookies.substring(0, 100) + "...");
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 📝 LOG: Erreur de réponse
    console.error("❌ API ERROR:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: originalRequest?.url,
      baseURL: originalRequest?.baseURL,
      message: error.message,
      responseData: error.response?.data,
    });

    // Gestion de l'erreur 401 (Non authentifié)
    if (error.response && error.response.status === 401) {
      // Éviter les boucles infinies de retry
      if (originalRequest._retry) {
        // Rediriger vers la page de connexion
        await handleLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token si un refresh token existe
        const refreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN
        );

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { token } = response.data;

          // Sauvegarder le nouveau token
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

          // Mettre à jour le header Authorization
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Réessayer la requête originale
          return api(originalRequest);
        } else {
          // Pas de refresh token, déconnecter l'utilisateur
          await handleLogout();
        }
      } catch (refreshError) {
        // Erreur lors du rafraîchissement, déconnecter l'utilisateur
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // Gestion des autres erreurs
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const errorMessage =
        error.response.data?.message || error.response.statusText;
      console.error(`Erreur API [${error.response.status}]:`, errorMessage);

      // Personnaliser les messages d'erreur
      switch (error.response.status) {
        case 400:
          error.userMessage =
            "Requête invalide. Veuillez vérifier vos données.";
          break;
        case 403:
          error.userMessage =
            "Accès refusé. Vous n'avez pas les permissions nécessaires.";
          break;
        case 404:
          error.userMessage = "Ressource non trouvée.";
          break;
        case 500:
          error.userMessage = "Erreur serveur. Veuillez réessayer plus tard.";
          break;
        default:
          error.userMessage = errorMessage || "Une erreur est survenue.";
      }
    } else if (error.request) {
      // La requête a été envoyée mais aucune réponse n'a été reçue
      console.error("Pas de réponse du serveur:", error.request);
      error.userMessage =
        "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
    } else {
      // Erreur lors de la configuration de la requête
      console.error("Erreur de configuration:", error.message);
      error.userMessage = "Une erreur est survenue lors de la requête.";
    }

    return Promise.reject(error);
  }
);

// Fonction pour gérer la déconnexion
const handleLogout = async () => {
  try {
    // Supprimer toutes les données d'authentification
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.DATABASE,
    ]);

    // Effacer les cookies de session
    sessionCookies = "";

    console.log("Déconnexion effectuée, données nettoyées");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};

// Fonction pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    return false;
  }
};

// Fonction pour définir le token manuellement (utile après connexion)
export const setAuthToken = async (token, refreshToken = null) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    if (refreshToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du token:", error);
    throw error;
  }
};

// Fonction pour se déconnecter (export pour utilisation dans l'app)
export const logout = handleLogout;

// Fonction pour obtenir les cookies actuels (utile pour le debug)
export const getSessionCookies = () => {
  return sessionCookies;
};

// Fonction pour effacer manuellement les cookies si nécessaire
export const clearSessionCookies = () => {
  sessionCookies = "";
  console.log("Cookies de session effacés");
};

// ✅ MODIFICATION : Fonction pour initialiser la session avec URL dynamique
export const initializeSession = async () => {
  try {
    const currentUrl = await apiConfigService.getApiUrl();

    if (!currentUrl) {
      console.error("❌ URL API non configurée");
      throw new Error("URL API non configurée");
    }

    console.log("🔐 Initialisation de la session Odoo...");
    console.log("🌐 URL:", currentUrl);

    const requestUrl = `${currentUrl}/web/database/list`;
    console.log("📤 Request URL:", requestUrl);

    // Appel POST sur /web/database/list pour obtenir le cookie de session
    const response = await axios.post(
      requestUrl,
      {
        jsonrpc: "2.0",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
        validateStatus: (status) => status >= 200 && status < 500,
      }
    );

    console.log("📥 Session init response:", {
      status: response.status,
      statusText: response.statusText,
      hasSetCookie: !!response.headers["set-cookie"],
    });

    // Capturer les cookies de la réponse
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      const cookieStrings = cookies.map((cookie) => {
        const cookieParts = cookie.split(";")[0];
        return cookieParts;
      });

      sessionCookies = cookieStrings.join("; ");
      console.log("✓ Cookie de session initialisé:", sessionCookies);
      return true;
    } else {
      console.warn("⚠ Aucun cookie reçu lors de l'initialisation");
      return false;
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la session:",
      error.message
    );
    return false;
  }
};

export default api;
