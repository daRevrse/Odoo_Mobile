/**
 * Fonctions utilitaires diverses
 * Helpers pour faciliter le développement
 */

/**
 * Génère un ID unique
 * @returns {string} ID unique
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Génère une référence unique
 * @param {string} prefix - Préfixe de la référence
 * @param {number} length - Longueur du numéro
 * @returns {string} Référence formatée
 */
export const generateReference = (prefix = "REF", length = 4) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
  return `${prefix}-${year}-${random}`;
};

/**
 * Attend un certain temps (pour async/await)
 * @param {number} ms - Millisecondes à attendre
 * @returns {Promise} Promise qui se résout après le délai
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Debounce une fonction
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai en ms
 * @returns {Function} Fonction debouncée
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Groupe un tableau par une clé
 * @param {Array} array - Tableau à grouper
 * @param {string} key - Clé de groupement
 * @returns {Object} Objet groupé
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Trie un tableau par une clé
 * @param {Array} array - Tableau à trier
 * @param {string} key - Clé de tri
 * @param {string} order - Ordre ('asc' ou 'desc')
 * @returns {Array} Tableau trié
 */
export const sortBy = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Filtre un tableau par recherche textuelle
 * @param {Array} array - Tableau à filtrer
 * @param {string} searchText - Texte de recherche
 * @param {Array} keys - Clés dans lesquelles chercher
 * @returns {Array} Tableau filtré
 */
export const filterBySearch = (array, searchText, keys) => {
  if (!searchText) return array;

  const lowerSearch = searchText.toLowerCase();

  return array.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(lowerSearch);
    })
  );
};

/**
 * Capitalise la première lettre
 * @param {string} str - Chaîne à capitaliser
 * @returns {string} Chaîne capitalisée
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Clone profond d'un objet
 * @param {any} obj - Objet à cloner
 * @returns {any} Objet cloné
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Vérifie si un objet est vide
 * @param {Object} obj - Objet à vérifier
 * @returns {boolean} True si vide
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === "string") return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === "object") return Object.keys(obj).length === 0;
  return false;
};

/**
 * Fusionne deux objets en profondeur
 * @param {Object} target - Objet cible
 * @param {Object} source - Objet source
 * @returns {Object} Objet fusionné
 */
export const deepMerge = (target, source) => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

/**
 * Extrait des valeurs uniques d'un tableau
 * @param {Array} array - Tableau
 * @param {string} key - Clé à extraire (optionnel)
 * @returns {Array} Valeurs uniques
 */
export const getUniqueValues = (array, key = null) => {
  if (key) {
    return [...new Set(array.map((item) => item[key]))];
  }
  return [...new Set(array)];
};

/**
 * Calcule une somme dans un tableau
 * @param {Array} array - Tableau
 * @param {string} key - Clé à sommer
 * @returns {number} Somme
 */
export const sumBy = (array, key) => {
  return array.reduce((sum, item) => {
    const value =
      typeof item[key] === "string"
        ? parseFloat(item[key].replace(/[^0-9.-]/g, ""))
        : item[key];
    return sum + (value || 0);
  }, 0);
};

/**
 * Trouve un élément par ID
 * @param {Array} array - Tableau
 * @param {string|number} id - ID à trouver
 * @param {string} key - Clé de l'ID (par défaut 'id')
 * @returns {Object|null} Élément trouvé ou null
 */
export const findById = (array, id, key = "id") => {
  return array.find((item) => item[key] === id) || null;
};

/**
 * Supprime un élément par ID
 * @param {Array} array - Tableau
 * @param {string|number} id - ID à supprimer
 * @param {string} key - Clé de l'ID (par défaut 'id')
 * @returns {Array} Nouveau tableau sans l'élément
 */
export const removeById = (array, id, key = "id") => {
  return array.filter((item) => item[key] !== id);
};

/**
 * Met à jour un élément par ID
 * @param {Array} array - Tableau
 * @param {string|number} id - ID de l'élément
 * @param {Object} updates - Modifications
 * @param {string} key - Clé de l'ID (par défaut 'id')
 * @returns {Array} Nouveau tableau avec l'élément modifié
 */
export const updateById = (array, id, updates, key = "id") => {
  return array.map((item) =>
    item[key] === id ? { ...item, ...updates } : item
  );
};

/**
 * Pagine un tableau
 * @param {Array} array - Tableau à paginer
 * @param {number} page - Numéro de page (commence à 1)
 * @param {number} perPage - Éléments par page
 * @returns {Object} { items, totalPages, currentPage }
 */
export const paginate = (array, page = 1, perPage = 10) => {
  const totalPages = Math.ceil(array.length / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    items: array.slice(start, end),
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Génère une couleur aléatoire
 * @returns {string} Couleur hex
 */
export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

/**
 * Calcule un pourcentage
 * @param {number} value - Valeur
 * @param {number} total - Total
 * @param {number} decimals - Nombre de décimales
 * @returns {number} Pourcentage
 */
export const calculatePercentage = (value, total, decimals = 0) => {
  if (!total || total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

/**
 * Convertit une chaîne en slug
 * @param {string} str - Chaîne à convertir
 * @returns {string} Slug
 */
export const slugify = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};
