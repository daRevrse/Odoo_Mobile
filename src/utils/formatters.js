/**
 * Fonctions de formatage
 * Pour formater les dates, montants, téléphones, etc.
 */

/**
 * Formate un montant en FCFA
 * @param {number|string} amount - Montant à formater
 * @param {boolean} showCurrency - Afficher FCFA ou non
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount, showCurrency = true) => {
  if (!amount && amount !== 0) return showCurrency ? "0 FCFA" : "0";

  const numAmount =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.-]/g, ""))
      : amount;

  const formatted = new Intl.NumberFormat("fr-FR").format(numAmount);
  return showCurrency ? `${formatted} FCFA` : formatted;
};

/**
 * Formate une date
 * @param {Date|string} date - Date à formater
 * @param {string} format - Format souhaité ('short', 'medium', 'long', 'time')
 * @returns {string} Date formatée
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  const options = {
    short: { day: "2-digit", month: "2-digit", year: "numeric" },
    medium: { day: "2-digit", month: "long", year: "numeric" },
    long: { weekday: "long", day: "2-digit", month: "long", year: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
  };

  return new Intl.DateTimeFormat("fr-FR", options[format]).format(dateObj);
};

/**
 * Formate un numéro de téléphone
 * @param {string} phone - Numéro à formater
 * @returns {string} Téléphone formaté
 */
export const formatPhone = (phone) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  // Format pour Togo: +228 90 12 34 56
  if (cleaned.length === 11 && cleaned.startsWith("228")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(
      5,
      7
    )} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }

  // Format pour numéro local: 90 12 34 56
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(
      4,
      6
    )} ${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Formate un pourcentage
 * @param {number} value - Valeur à formater
 * @param {number} decimals - Nombre de décimales
 * @returns {string} Pourcentage formaté
 */
export const formatPercentage = (value, decimals = 0) => {
  if (!value && value !== 0) return "0%";
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formate une durée en temps lisible
 * @param {number} minutes - Durée en minutes
 * @returns {string} Durée formatée
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return "0 min";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

/**
 * Formate un nom (première lettre en majuscule)
 * @param {string} name - Nom à formater
 * @returns {string} Nom formaté
 */
export const formatName = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Formate une taille de fichier
 * @param {number} bytes - Taille en bytes
 * @returns {string} Taille formatée
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formate un temps relatif (il y a X jours)
 * @param {Date|string} date - Date à comparer
 * @returns {string} Temps relatif
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} ans`;
};

/**
 * Tronque un texte et ajoute "..."
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Formate une référence (ajoute des zéros devant)
 * @param {string|number} ref - Référence à formater
 * @param {number} length - Longueur souhaitée
 * @returns {string} Référence formatée
 */
export const formatReference = (ref, length = 4) => {
  if (!ref) return "";
  const refStr = ref.toString();
  return refStr.padStart(length, "0");
};

/**
 * Formate les initiales d'un nom
 * @param {string} name - Nom complet
 * @returns {string} Initiales
 */
export const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0].charAt(0)}${words[words.length - 1].charAt(
    0
  )}`.toUpperCase();
};
