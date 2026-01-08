import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Clé de stockage pour le branding
 */
const BRANDING_KEY = "APP_BRANDING";

/**
 * État actuel du branding (en mémoire pour accès rapide)
 */
let currentBranding = {
  app_name: "Odoo Mobile BS",
  logo_url: null,
  primary_color: "#990000",
  secondary_color: "#333333",
};

/**
 * Initialiser le branding depuis le stockage local
 * @returns {Promise<Object>} Branding initialisé
 */
export const initializeBranding = async () => {
  try {
    const storedBranding = await AsyncStorage.getItem(BRANDING_KEY);

    if (storedBranding) {
      const branding = JSON.parse(storedBranding);
      currentBranding = { ...currentBranding, ...branding };
      console.log("🎨 Branding initialisé:", currentBranding.app_name);
    }

    return currentBranding;
  } catch (error) {
    console.error("Erreur lors de l'initialisation du branding:", error);
    return currentBranding;
  }
};

/**
 * Appliquer un nouveau branding
 * @param {Object} branding - Nouvelles données de branding
 * @returns {Promise<Object>} Branding appliqué
 */
export const applyBranding = async (branding) => {
  try {
    if (!branding || typeof branding !== "object") {
      throw new Error("Branding invalide");
    }

    // Fusionner avec le branding actuel
    currentBranding = {
      ...currentBranding,
      ...branding,
    };

    // Sauvegarder dans le stockage local
    await AsyncStorage.setItem(BRANDING_KEY, JSON.stringify(currentBranding));

    console.log("✅ Branding appliqué:", currentBranding.app_name);

    return currentBranding;
  } catch (error) {
    console.error("Erreur lors de l'application du branding:", error);
    throw error;
  }
};

/**
 * Récupérer le branding actuel
 * @returns {Object} Branding actuel
 */
export const getBranding = () => {
  return currentBranding;
};

/**
 * Récupérer la couleur primaire
 * @returns {string} Couleur primaire (ex: "#990000")
 */
export const getPrimaryColor = () => {
  return currentBranding.primary_color || "#990000";
};

/**
 * Récupérer la couleur secondaire
 * @returns {string} Couleur secondaire (ex: "#333333")
 */
export const getSecondaryColor = () => {
  return currentBranding.secondary_color || "#333333";
};

/**
 * Récupérer le nom de l'application
 * @returns {string} Nom de l'application
 */
export const getAppName = () => {
  return currentBranding.app_name || "Odoo Mobile BS";
};

/**
 * Récupérer l'URL du logo
 * @returns {string|null} URL du logo ou null
 */
export const getLogoUrl = () => {
  return currentBranding.logo_url;
};

/**
 * Vérifier si un logo personnalisé est défini
 * @returns {boolean} True si un logo est défini
 */
export const hasCustomLogo = () => {
  return !!currentBranding.logo_url;
};

/**
 * Réinitialiser le branding aux valeurs par défaut
 * @returns {Promise<void>}
 */
export const resetBranding = async () => {
  try {
    currentBranding = {
      app_name: "Odoo Mobile BS",
      logo_url: null,
      primary_color: "#990000",
      secondary_color: "#333333",
    };

    await AsyncStorage.removeItem(BRANDING_KEY);
    console.log("🔄 Branding réinitialisé aux valeurs par défaut");
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du branding:", error);
  }
};

/**
 * Obtenir un style avec la couleur primaire
 * @param {Object} baseStyle - Style de base
 * @returns {Object} Style avec couleur primaire appliquée
 */
export const withPrimaryColor = (baseStyle = {}) => {
  return {
    ...baseStyle,
    color: getPrimaryColor(),
  };
};

/**
 * Obtenir un style avec la couleur de fond primaire
 * @param {Object} baseStyle - Style de base
 * @returns {Object} Style avec couleur de fond primaire appliquée
 */
export const withPrimaryBackground = (baseStyle = {}) => {
  return {
    ...baseStyle,
    backgroundColor: getPrimaryColor(),
  };
};

/**
 * Obtenir un style avec la couleur secondaire
 * @param {Object} baseStyle - Style de base
 * @returns {Object} Style avec couleur secondaire appliquée
 */
export const withSecondaryColor = (baseStyle = {}) => {
  return {
    ...baseStyle,
    color: getSecondaryColor(),
  };
};

/**
 * Obtenir un style avec la couleur de fond secondaire
 * @param {Object} baseStyle - Style de base
 * @returns {Object} Style avec couleur de fond secondaire appliquée
 */
export const withSecondaryBackground = (baseStyle = {}) => {
  return {
    ...baseStyle,
    backgroundColor: getSecondaryColor(),
  };
};

/**
 * Générer une version claire de la couleur primaire (pour backgrounds)
 * @param {number} opacity - Opacité (0-1)
 * @returns {string} Couleur avec opacité (ex: "rgba(153, 0, 0, 0.2)")
 */
export const getPrimaryColorWithOpacity = (opacity = 0.2) => {
  const color = getPrimaryColor();

  // Convertir hex en RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Vérifier si une couleur est claire ou sombre
 * @param {string} hexColor - Couleur au format hex (ex: "#990000")
 * @returns {boolean} True si la couleur est claire
 */
export const isLightColor = (hexColor) => {
  const color = hexColor || getPrimaryColor();

  // Convertir hex en RGB
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Calculer la luminosité (formule standard)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

/**
 * Obtenir la couleur de texte contrastée pour la couleur primaire
 * @returns {string} "#FFFFFF" ou "#000000"
 */
export const getContrastTextColor = () => {
  return isLightColor(getPrimaryColor()) ? "#000000" : "#FFFFFF";
};
