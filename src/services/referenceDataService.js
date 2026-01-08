import api from "./api";

/**
 * Service pour récupérer les données de référence depuis Odoo
 */

// Cache pour éviter les appels répétés
const cache = {
  countries: null,
  languages: null,
  currencies: null,
};

/**
 * Récupère la liste des pays
 * @returns {Promise<Array>} Liste des pays avec id, name, code
 */
export const getCountries = async () => {
  try {
    if (cache.countries) {
      console.log("📦 Pays récupérés depuis le cache");
      return cache.countries;
    }

    console.log("📡 Récupération de la liste des pays...");
    const response = await api.get("/res.country");

    console.log("📥 Réponse pays:", response.data);

    // La réponse est un objet avec { count, results }
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      // Transformer les données pour avoir un format simple
      const countries = response.data.results.map((country) => ({
        id: country.id,
        name: country.display_name || country.name || "Sans nom",
        code: country.code,
      }));

      cache.countries = countries;
      console.log(`✅ ${countries.length} pays récupérés`);
      return countries;
    }

    return [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des pays:", error);
    throw error;
  }
};

/**
 * Récupère la liste des langues
 * @returns {Promise<Array>} Liste des langues avec id, name, code
 */
export const getLanguages = async () => {
  try {
    if (cache.languages) {
      console.log("📦 Langues récupérées depuis le cache");
      return cache.languages;
    }

    console.log("📡 Récupération de la liste des langues...");
    const response = await api.get("/res.lang");

    console.log("📥 Réponse langues:", response.data);

    // La réponse est un objet avec { count, results }
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      // Transformer les données pour avoir un format simple
      const languages = response.data.results.map((lang) => ({
        id: lang.id,
        name: lang.display_name || lang.name || "Sans nom",
        code: lang.code,
      }));

      cache.languages = languages;
      console.log(`✅ ${languages.length} langues récupérées`);
      return languages;
    }

    return [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des langues:", error);
    throw error;
  }
};

/**
 * Récupère la liste des devises
 * @returns {Promise<Array>} Liste des devises avec id, name, symbol
 */
export const getCurrencies = async () => {
  try {
    if (cache.currencies) {
      console.log("📦 Devises récupérées depuis le cache");
      return cache.currencies;
    }

    console.log("📡 Récupération de la liste des devises...");
    const response = await api.get("/res.currency");

    console.log("📥 Réponse devises:", response.data);

    // La réponse est un objet avec { count, results }
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      // Transformer les données pour avoir un format simple
      const currencies = response.data.results.map((currency) => ({
        id: currency.id,
        name: currency.display_name || currency.name || "Sans nom",
        symbol: currency.symbol,
      }));

      cache.currencies = currencies;
      console.log(`✅ ${currencies.length} devises récupérées`);
      return currencies;
    }

    return [];
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des devises:", error);
    throw error;
  }
};

/**
 * Trouve un pays par son ID
 * @param {number} countryId - ID du pays
 * @returns {Promise<Object|null>} Pays trouvé ou null
 */
export const getCountryById = async (countryId) => {
  try {
    const countries = await getCountries();
    return countries.find((c) => c.id === countryId) || null;
  } catch (error) {
    console.error("❌ Erreur lors de la recherche du pays:", error);
    return null;
  }
};

/**
 * Trouve un pays par son nom
 * @param {string} countryName - Nom du pays
 * @returns {Promise<Object|null>} Pays trouvé ou null
 */
export const getCountryByName = async (countryName) => {
  try {
    const countries = await getCountries();
    return (
      countries.find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
      ) || null
    );
  } catch (error) {
    console.error("❌ Erreur lors de la recherche du pays:", error);
    return null;
  }
};

/**
 * Efface le cache des données de référence
 */
export const clearCache = () => {
  cache.countries = null;
  cache.languages = null;
  cache.currencies = null;
  console.log("🗑️ Cache des données de référence effacé");
};

export default {
  getCountries,
  getLanguages,
  getCurrencies,
  getCountryById,
  getCountryByName,
  clearCache,
};
