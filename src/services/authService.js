import AsyncStorage from "@react-native-async-storage/async-storage";
import api, {
  setAuthToken,
  logout as apiLogout,
  STORAGE_KEYS,
} from "./api";
import apiConfigService from "./apiConfigService";

/**
 * Service d'authentification pour l'application Odoo Mobile
 */
class AuthService {
  /**
   * Connexion utilisateur
   * @param {string} db - Nom de la base de donn�es
   * @param {string} login - Identifiant de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise<Object>} Donn�es de l'utilisateur connect�
   */
  async login(db, login, password) {
    try {
      console.log("🔐 === DÉBUT LOGIN ===");
      console.log("🔐 Database:", db);
      console.log("🔐 Login:", login);

      // Récupérer l'URL dynamique depuis le service
      const odooUrl = await apiConfigService.getApiUrl();
      console.log("🔐 ODOO_BASE_URL (dynamique):", odooUrl);

      if (!odooUrl) {
        throw new Error("URL du serveur non configurée");
      }

      // Validation des param�tres
      if (!db || !login || !password) {
        throw new Error(
          "Tous les champs sont obligatoires (db, login, password)"
        );
      }

      const authUrl = "/web/session/authenticate";
      console.log("📤 Auth endpoint:", authUrl);
      console.log("📤 Base URL utilisée:", odooUrl);
      console.log("📤 URL complète:", `${odooUrl}${authUrl}`);

      // Appel API de connexion sur /web/session/authenticate
      // Utilisation de l'instance api pour b�n�ficier des intercepteurs
      const response = await api.post(
        authUrl,
        {
          jsonrpc: "2.0",
          params: {
            db,
            login,
            password,
          },
        },
        {
          baseURL: odooUrl,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Login response status:", response.status);
      console.log("📥 Login response data keys:", Object.keys(response.data || {}));

      const { data } = response;

      // V�rifier que la r�ponse contient les donn�es n�cessaires
      if (!data || !data.result) {
        console.error("❌ Réponse invalide:", data);
        throw new Error("R�ponse invalide du serveur");
      }

      const result = data.result;
      console.log("✅ Login result:", {
        hasUid: !!result.uid,
        hasUsername: !!result.username,
        hasName: !!result.name,
        hasSessionId: !!result.session_id,
      });

      // V�rifier que l'authentification a r�ussi
      if (!result.uid) {
        console.error("❌ Pas d'UID dans la réponse");
        throw new Error("Authentification �chou�e");
      }

      // Extraire les donn�es de la r�ponse
      const { uid, username, name, company_id, partner_id, session_id } =
        result;

      // Sauvegarder les informations utilisateur
      const userData = {
        uid,
        login: username || login,
        name: name || username || login,
        db,
        company_id,
        partner_id,
        session_id,
        loginTime: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
      await AsyncStorage.setItem(STORAGE_KEYS.DATABASE, db);

      console.log("✅ Connexion réussie pour:", login);
      console.log("✅ User data sauvegardé:", { uid, name, db });

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error("❌ === ERREUR LOGIN ===");
      console.error("❌ Error message:", error.message);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      // Gestion des erreurs sp�cifiques
      let errorMessage = "Erreur de connexion";

      if (error.response) {
        // V�rifier si c'est une erreur Odoo jsonrpc
        if (error.response.data?.error) {
          const odooError = error.response.data.error;
          errorMessage =
            odooError.data?.message ||
            odooError.message ||
            "Identifiants incorrects";
        } else {
          switch (error.response.status) {
            case 401:
              errorMessage = "Identifiants incorrects";
              break;
            case 404:
              errorMessage = "Base de donn�es introuvable";
              break;
            case 500:
              errorMessage = "Erreur serveur. Veuillez r�essayer plus tard.";
              break;
            default:
              errorMessage =
                error.response.data?.message ||
                error.userMessage ||
                "Erreur de connexion";
          }
        }
      } else if (error.request) {
        errorMessage =
          "Impossible de se connecter au serveur. V�rifiez votre connexion internet.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * R�cup�ration du profil utilisateur
   * @returns {Promise<Object>} Profil de l'utilisateur
   */
  async getUserProfile() {
    try {
      const response = await api.get("/user/profile");

      const { data } = response;

      if (!data || !data.success || !data.profile) {
        throw new Error("Impossible de récupérer le profil utilisateur");
      }

      return {
        success: true,
        profile: data.profile,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);

      let errorMessage = "Impossible de récupéré le profil";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Session expirée. Veuillez vous reconnecter.";
            break;
          case 404:
            errorMessage = "Profil non trouvé.";
            break;
          case 500:
            errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage =
          "Impossible de se connecter au serveur. V�rifiez votre connexion internet.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * D�connexion utilisateur
   * @returns {Promise<Object>} R�sultat de la d�connexion
   */
  async logout() {
    try {
      // Appeler l'endpoint de d�connexion sur le serveur
      try {
        await api.post("/user/logout");
        console.log("D�connexion serveur r�ussie");
      } catch (apiError) {
        // Continuer m�me si l'appel API �choue
        console.warn(
          "Erreur lors de l'appel API de d�connexion:",
          apiError.message
        );
      }

      // Supprimer les donn�es locales via le service API
      await apiLogout();

      console.log("D�connexion r�ussie");

      return {
        success: true,
        message: "D�connexion r�ussie",
      };
    } catch (error) {
      console.error("Erreur lors de la d�connexion:", error);

      // M�me en cas d'erreur, on tente de nettoyer les donn�es locales
      try {
        await apiLogout();
      } catch (cleanupError) {
        console.error("Erreur lors du nettoyage des donn�es:", cleanupError);
      }

      return {
        success: false,
        message: "Erreur lors de la d�connexion",
        error,
      };
    }
  }

  /**
   * V�rification de l'�tat de connexion
   * @returns {Promise<boolean>} true si l'utilisateur est authentifi�, false sinon
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      // V�rifier que le token et les donn�es utilisateur existent
      if (!token || !userData) {
        return false;
      }

      // Optionnel: V�rifier la validit� du token (expiration)
      // Cela peut �tre fait en d�codant le JWT si n�cessaire

      return true;
    } catch (error) {
      console.error(
        "Erreur lors de la v�rification de l'authentification:",
        error
      );
      return false;
    }
  }

  /**
   * R�cup�re les donn�es de l'utilisateur connect�
   * @returns {Promise<Object|null>} Donn�es utilisateur ou null si non connect�
   */
  async getUserData() {
    try {
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (!userDataString) {
        return null;
      }

      return JSON.parse(userDataString);
    } catch (error) {
      console.error(
        "Erreur lors de la r�cup�ration des donn�es utilisateur:",
        error
      );
      return null;
    }
  }

  /**
   * R�cup�re le nom de la base de donn�es courante
   * @returns {Promise<string|null>} Nom de la base de donn�es ou null
   */
  async getCurrentDatabase() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.DATABASE);
    } catch (error) {
      console.error(
        "Erreur lors de la r�cup�ration de la base de donn�es:",
        error
      );
      return null;
    }
  }

  /**
   * R�cup�re le token d'authentification
   * @returns {Promise<string|null>} Token d'authentification ou null
   */
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error("Erreur lors de la r�cup�ration du token:", error);
      return null;
    }
  }

  /**
   * V�rifie si la session est toujours valide en testant une requ�te
   * @returns {Promise<boolean>} true si la session est valide
   */
  async validateSession() {
    try {
      // Effectuer une requ�te simple pour v�rifier la validit� de la session
      const response = await api.get("/user/me");
      return response.status === 200;
    } catch (error) {
      console.error("Session invalide:", error);
      return false;
    }
  }
}

// Export d'une instance unique (singleton)
const authService = new AuthService();

export default authService;
