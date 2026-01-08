import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

/**
 * Clé de stockage pour l'URL de l'API
 */
const API_URL_KEY = "ODOO_API_URL";

/**
 * Service de gestion de la configuration de l'URL API
 */
class ApiConfigService {
  /**
   * Sauvegarder l'URL de l'API
   * @param {string} url - URL de l'API Odoo (ex: "http://161.97.125.198:11077")
   * @returns {Promise<Object>} Résultat de la sauvegarde
   */
  async saveApiUrl(url) {
    try {
      // Nettoyer l'URL (enlever le slash final si présent)
      const cleanUrl = url.trim().replace(/\/$/, "");

      // Valider le format de l'URL
      if (!this._isValidUrl(cleanUrl)) {
        throw new Error("URL invalide");
      }

      // Tester la connexion avant de sauvegarder
      const isReachable = await this.testConnection(cleanUrl);

      if (!isReachable) {
        throw new Error("Impossible de se connecter au serveur");
      }

      // Sauvegarder l'URL
      await AsyncStorage.setItem(API_URL_KEY, cleanUrl);

      console.log("✅ URL API sauvegardée:", cleanUrl);

      return {
        success: true,
        url: cleanUrl,
      };
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'URL API:", error);
      return {
        success: false,
        error: error.message || "Erreur lors de la sauvegarde",
      };
    }
  }

  /**
   * Récupérer l'URL de l'API sauvegardée
   * @returns {Promise<string|null>} URL de l'API ou null
   */
  async getApiUrl() {
    try {
      const url = await AsyncStorage.getItem(API_URL_KEY);
      return url;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'URL API:", error);
      return null;
    }
  }

  /**
   * Vérifier si une URL API est configurée
   * @returns {Promise<boolean>} True si configurée
   */
  async hasApiUrl() {
    const url = await this.getApiUrl();
    return !!url;
  }

  /**
   * Effacer l'URL de l'API
   * @returns {Promise<void>}
   */
  async clearApiUrl() {
    try {
      await AsyncStorage.removeItem(API_URL_KEY);
      console.log("🗑️ URL API effacée");
    } catch (error) {
      console.error("Erreur lors de l'effacement de l'URL API:", error);
    }
  }

  /**
   * Tester la connexion à un serveur Odoo
   * @param {string} url - URL à tester
   * @returns {Promise<boolean>} True si le serveur est accessible
   */
  async testConnection(url) {
    try {
      console.log("🔍 Test de connexion à:", url);

      // Tenter d'appeler l'endpoint /web/database/list
      const response = await axios.post(
        `${url}/web/database/list`,
        {
          jsonrpc: "2.0",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 secondes
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      // Vérifier que la réponse est valide
      if (response.data && response.data.result) {
        console.log("✅ Connexion réussie au serveur");
        return true;
      }

      console.warn("⚠️ Réponse inattendue du serveur");
      return false;
    } catch (error) {
      console.error("❌ Échec de connexion au serveur:", error.message);
      return false;
    }
  }

  /**
   * Extraire l'URL depuis un QR code
   * @param {string} qrData - Données du QR code
   * @returns {Object} URL extraite et validité
   */
  parseQRCode(qrData) {
    try {
      // Le QR code peut contenir soit :
      // 1. Directement l'URL : "http://161.97.125.198:11077"
      // 2. Un JSON : {"url": "http://161.97.125.198:11077", "name": "MonEntreprise"}

      let url = qrData.trim();

      // Essayer de parser en JSON
      try {
        const parsed = JSON.parse(qrData);
        if (parsed.url) {
          url = parsed.url;
        }
      } catch (e) {
        // Pas un JSON, utiliser directement comme URL
      }

      // Nettoyer l'URL
      url = url.replace(/\/$/, "");

      // Valider
      if (!this._isValidUrl(url)) {
        return {
          success: false,
          error: "Format d'URL invalide",
        };
      }

      return {
        success: true,
        url: url,
      };
    } catch (error) {
      return {
        success: false,
        error: "QR code invalide",
      };
    }
  }

  /**
   * Valider le format d'une URL
   * @param {string} url - URL à valider
   * @returns {boolean} True si valide
   * @private
   */
  _isValidUrl(url) {
    try {
      // Vérifier le format basique
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(url)) {
        return false;
      }

      // Essayer de créer un objet URL
      new URL(url);

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtenir des informations sur le serveur
   * @param {string} url - URL du serveur
   * @returns {Promise<Object>} Informations du serveur
   */
  async getServerInfo(url) {
    try {
      const response = await axios.post(
        `${url}/web/database/list`,
        {
          jsonrpc: "2.0",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      const databases = response.data?.result || [];

      return {
        success: true,
        url: url,
        databases: databases,
        databaseCount: databases.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Export d'une instance unique (singleton)
const apiConfigService = new ApiConfigService();

export default apiConfigService;
