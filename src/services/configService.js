import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { DEFAULT_CONFIG, TEST_CONFIG_1 } from "../constants/defaultConfig";

/**
 * Clés de stockage pour la configuration
 */
const STORAGE_KEYS = {
  APP_CONFIG: "APP_CONFIG",
  CONFIG_TIMESTAMP: "CONFIG_TIMESTAMP",
  CONFIG_VERSION: "CONFIG_VERSION",
};

/**
 * Service de gestion de la configuration de l'application
 */
class ConfigService {
  /**
   * Récupérer la configuration depuis le serveur Odoo
   * @param {boolean} useTestConfig - Utiliser une config de test au lieu du serveur
   * @returns {Promise<Object>} Configuration de l'application
   */
  async fetchUserConfig(useTestConfig = false) {
    try {
      console.log("📥 Récupération de la configuration...");

      // Mode TEST : retourner une config de test
      if (useTestConfig) {
        console.log("🧪 Mode TEST activé - Utilisation de TEST_CONFIG_1");
        await this.saveConfig(DEFAULT_CONFIG);
        return {
          success: true,
          config: DEFAULT_CONFIG,
          fromTest: true,
        };
      }

      // Appel API vers le module Odoo (endpoint à créer par l'autre équipe)
      const response = await api.post("/mobile_config/get_user_config", {
        jsonrpc: "2.0",
        params: {},
      });

      const config = response.data?.result || null;

      if (!config) {
        throw new Error("Configuration vide reçue du serveur");
      }

      // Valider la structure de la config
      if (!this._validateConfig(config)) {
        throw new Error("Configuration invalide reçue du serveur");
      }

      // Sauvegarder la config localement
      await this.saveConfig(config);

      console.log("✅ Configuration téléchargée et sauvegardée");

      return {
        success: true,
        config: config,
      };
    } catch (error) {
      console.error("❌ Erreur lors du téléchargement de la config:", error);

      // Tentative de récupération de la config en cache
      const cachedConfig = await this.getStoredConfig();

      if (cachedConfig) {
        console.log("📦 Utilisation de la configuration en cache");
        return {
          success: true,
          config: cachedConfig,
          fromCache: true,
          error: error.message,
        };
      }

      // Dernier recours : config par défaut
      console.log("⚠️ Utilisation de la configuration par défaut");
      await this.saveConfig(DEFAULT_CONFIG);

      return {
        success: true,
        config: DEFAULT_CONFIG,
        fromDefault: true,
        error: error.message,
      };
    }
  }

  /**
   * Sauvegarder la configuration localement
   * @param {Object} config - Configuration à sauvegarder
   * @returns {Promise<void>}
   */
  async saveConfig(config) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.APP_CONFIG,
        JSON.stringify(config)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONFIG_TIMESTAMP,
        new Date().toISOString()
      );
      console.log("💾 Configuration sauvegardée localement");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la config:", error);
      throw error;
    }
  }

  /**
   * Récupérer la configuration stockée localement
   * @returns {Promise<Object|null>} Configuration ou null
   */
  async getStoredConfig() {
    try {
      const configStr = await AsyncStorage.getItem(STORAGE_KEYS.APP_CONFIG);

      if (!configStr) {
        return null;
      }

      const config = JSON.parse(configStr);
      return config;
    } catch (error) {
      console.error("Erreur lors de la lecture de la config:", error);
      return null;
    }
  }

  /**
   * Vérifier si un module est activé
   * @param {string} moduleName - Nom du module (ex: "contacts", "ventes")
   * @returns {Promise<boolean>} True si le module est activé
   */
  async isModuleEnabled(moduleName) {
    try {
      const config = await this.getStoredConfig();

      if (!config || !config.modules) {
        return false;
      }

      const module = config.modules[moduleName];
      return module?.enabled === true;
    } catch (error) {
      console.error("Erreur lors de la vérification du module:", error);
      return false;
    }
  }

  /**
   * Récupérer les permissions d'un module
   * @param {string} moduleName - Nom du module
   * @returns {Promise<Array>} Liste des permissions (ex: ["read", "write"])
   */
  async getModulePermissions(moduleName) {
    try {
      const config = await this.getStoredConfig();

      if (!config || !config.modules) {
        return [];
      }

      const module = config.modules[moduleName];
      return module?.permissions || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions:", error);
      return [];
    }
  }

  /**
   * Récupérer la liste des modules activés
   * @returns {Promise<Array>} Liste des modules activés avec leurs infos
   */
  async getEnabledModules() {
    try {
      const config = await this.getStoredConfig();

      if (!config || !config.modules) {
        return [];
      }

      // Récupérer l'ordre personnalisé s'il existe
      const customOrder = await AsyncStorage.getItem("MODULES_CUSTOM_ORDER");

      const enabledModules = Object.keys(config.modules)
        .filter((key) => config.modules[key].enabled === true)
        .map((key) => ({
          key,
          ...config.modules[key],
        }));

      // Si un ordre personnalisé existe, l'appliquer
      if (customOrder) {
        try {
          const orderArray = JSON.parse(customOrder);
          const orderedModules = [];

          // Ajouter les modules dans l'ordre personnalisé
          orderArray.forEach((key) => {
            const module = enabledModules.find((m) => m.key === key);
            if (module) {
              orderedModules.push(module);
            }
          });

          // Ajouter les nouveaux modules qui n'étaient pas dans l'ordre sauvegardé
          enabledModules.forEach((module) => {
            if (!orderedModules.find((m) => m.key === module.key)) {
              orderedModules.push(module);
            }
          });

          return orderedModules;
        } catch (parseError) {
          console.error("Erreur parsing ordre personnalisé:", parseError);
        }
      }

      return enabledModules;
    } catch (error) {
      console.error("Erreur lors de la récupération des modules:", error);
      return [];
    }
  }

  /**
   * Sauvegarder l'ordre personnalisé des modules
   * @param {Array} modules - Liste des modules dans l'ordre souhaité
   * @returns {Promise<void>}
   */
  async saveModulesOrder(modules) {
    try {
      const moduleKeys = modules.map((m) => m.key);
      await AsyncStorage.setItem(
        "MODULES_CUSTOM_ORDER",
        JSON.stringify(moduleKeys)
      );
      console.log("💾 Ordre des modules sauvegardé:", moduleKeys);
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde de l'ordre des modules:",
        error
      );
      throw error;
    }
  }

  /**
   * Réinitialiser l'ordre personnalisé des modules
   * @returns {Promise<void>}
   */
  async resetModulesOrder() {
    try {
      await AsyncStorage.removeItem("MODULES_CUSTOM_ORDER");
      console.log("🗑️ Ordre personnalisé des modules effacé");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation de l'ordre:", error);
      throw error;
    }
  }

  /**
   * Récupérer le branding de l'application
   * @returns {Promise<Object>} Informations de branding
   */
  async getBranding() {
    try {
      const config = await this.getStoredConfig();

      if (!config || !config.branding) {
        return DEFAULT_CONFIG.branding;
      }

      return config.branding;
    } catch (error) {
      console.error("Erreur lors de la récupération du branding:", error);
      return DEFAULT_CONFIG.branding;
    }
  }

  /**
   * Récupérer les paramètres de l'application
   * @returns {Promise<Object>} Paramètres
   */
  async getSettings() {
    try {
      const config = await this.getStoredConfig();

      if (!config || !config.settings) {
        return DEFAULT_CONFIG.settings;
      }

      return config.settings;
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres:", error);
      return DEFAULT_CONFIG.settings;
    }
  }

  /**
   * Vérifier l'âge de la configuration en cache
   * @returns {Promise<number>} Âge en heures
   */
  async getConfigAge() {
    try {
      const timestamp = await AsyncStorage.getItem(
        STORAGE_KEYS.CONFIG_TIMESTAMP
      );

      if (!timestamp) {
        return Infinity;
      }

      const configDate = new Date(timestamp);
      const now = new Date();
      const ageInHours = (now - configDate) / (1000 * 60 * 60);

      return ageInHours;
    } catch (error) {
      console.error("Erreur lors du calcul de l'âge de la config:", error);
      return Infinity;
    }
  }

  /**
   * Vérifier si la configuration doit être rafraîchie
   * @param {number} maxAgeInHours - Âge maximum en heures (défaut: 24h)
   * @returns {Promise<boolean>} True si un rafraîchissement est nécessaire
   */
  async shouldRefreshConfig(maxAgeInHours = 24) {
    try {
      const age = await this.getConfigAge();
      return age >= maxAgeInHours;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du rafraîchissement:",
        error
      );
      return false;
    }
  }

  /**
   * Forcer le rechargement de la configuration
   * @param {boolean} useTestConfig - Utiliser une config de test
   * @returns {Promise<Object>} Nouvelle configuration
   */
  async refreshConfig(useTestConfig = false) {
    console.log("🔄 Rafraîchissement de la configuration...");
    return await this.fetchUserConfig(useTestConfig);
  }

  /**
   * Effacer la configuration locale (utile pour le logout)
   * @returns {Promise<void>}
   */
  async clearConfig() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.APP_CONFIG);
      await AsyncStorage.removeItem(STORAGE_KEYS.CONFIG_TIMESTAMP);
      await AsyncStorage.removeItem(STORAGE_KEYS.CONFIG_VERSION);
      console.log("🗑️ Configuration locale effacée");
    } catch (error) {
      console.error("Erreur lors de l'effacement de la config:", error);
    }
  }

  /**
   * Valider la structure d'une configuration
   * @param {Object} config - Configuration à valider
   * @returns {boolean} True si valide
   * @private
   */
  _validateConfig(config) {
    // Vérifications basiques
    if (!config || typeof config !== "object") {
      return false;
    }

    // Vérifier la présence des sections principales
    if (!config.branding || !config.modules) {
      return false;
    }

    // Vérifier le branding
    if (!config.branding.app_name || !config.branding.primary_color) {
      return false;
    }

    // Vérifier que modules est un objet
    if (typeof config.modules !== "object") {
      return false;
    }

    return true;
  }
}

// Export d'une instance unique (singleton)
const configService = new ConfigService();

export default configService;
