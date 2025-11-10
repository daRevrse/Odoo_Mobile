import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuration de l'API
export const API_BASE_URL = "http://161.97.125.198:11077/bs_mobile_api";
export const ODOO_BASE_URL = "http://161.97.125.198:11077";

// Clés de stockage
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
  DATABASE: "database",
};

// Store pour les cookies de session
let sessionCookies = "";

// Création de l'instance Axios avec support des cookies
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // On gère manuellement les cookies pour React Native
});

// Intercepteur de requête pour ajouter le token d'authentification et les cookies
api.interceptors.request.use(
  async (config) => {
    try {
      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Ajouter les cookies de session s'ils existent
      if (sessionCookies) {
        config.headers.Cookie = sessionCookies;
      }

      return config;
    } catch (error) {
      console.error("Erreur lors de la configuration de la requête:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs et capturer les cookies
api.interceptors.response.use(
  (response) => {
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
      console.log("Cookies de session capturés et stockés automatiquement");
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

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
      console.error("Erreur réseau:", error.message);
      error.userMessage =
        "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
    } else {
      // Erreur lors de la configuration de la requête
      console.error("Erreur:", error.message);
      error.userMessage = "Une erreur inattendue est survenue.";
    }

    return Promise.reject(error);
  }
);

// Fonction pour gérer la déconnexion
const handleLogout = async () => {
  try {
    // Supprimer les tokens et les données utilisateur
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.DATABASE,
    ]);

    // Nettoyer les cookies de session
    sessionCookies = "";

    // Note: La navigation vers l'écran de connexion devra être gérée
    // depuis les composants React Native en écoutant les changements d'état
    console.log("Utilisateur déconnecté");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};

// Fonction utilitaire pour vérifier si l'utilisateur est authentifié
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

// Fonction pour initialiser la session en récupérant le cookie depuis Odoo
export const initializeSession = async () => {
  try {
    console.log("Initialisation de la session Odoo...");

    // Appel POST sur /web/database/list pour obtenir le cookie de session
    const response = await axios.post(
      `${ODOO_BASE_URL}/web/database/list`,
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
