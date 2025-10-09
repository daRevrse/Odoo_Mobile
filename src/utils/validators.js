/**
 * Fonctions de validation
 * Pour valider les formulaires, emails, téléphones, etc.
 */

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone (Togo)
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} True si valide
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, "");

  // Formats acceptés:
  // - 90123456 (8 chiffres)
  // - 22890123456 (11 chiffres avec code pays)
  return (
    cleaned.length === 8 || (cleaned.length === 11 && cleaned.startsWith("228"))
  );
};

/**
 * Valide un mot de passe
 * @param {string} password - Mot de passe à valider
 * @param {Object} options - Options de validation
 * @returns {Object} { isValid, errors }
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false,
  } = options;

  const errors = [];

  if (!password) {
    errors.push("Le mot de passe est requis");
    return { isValid: false, errors };
  }

  if (password.length < minLength) {
    errors.push(
      `Le mot de passe doit contenir au moins ${minLength} caractères`
    );
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valide que deux mots de passe correspondent
 * @param {string} password - Mot de passe
 * @param {string} confirmPassword - Confirmation
 * @returns {boolean} True si correspondent
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valide un montant
 * @param {string|number} amount - Montant à valider
 * @param {Object} options - Options de validation
 * @returns {Object} { isValid, error }
 */
export const validateAmount = (amount, options = {}) => {
  const { min = 0, max, required = true } = options;

  if (!amount && amount !== 0) {
    return {
      isValid: !required,
      error: required ? "Le montant est requis" : null,
    };
  }

  const numAmount =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.-]/g, ""))
      : amount;

  if (isNaN(numAmount)) {
    return { isValid: false, error: "Montant invalide" };
  }

  if (numAmount < min) {
    return { isValid: false, error: `Le montant doit être supérieur à ${min}` };
  }

  if (max !== undefined && numAmount > max) {
    return { isValid: false, error: `Le montant doit être inférieur à ${max}` };
  }

  return { isValid: true, error: null };
};

/**
 * Valide une date
 * @param {string|Date} date - Date à valider
 * @param {Object} options - Options de validation
 * @returns {Object} { isValid, error }
 */
export const validateDate = (date, options = {}) => {
  const { min, max, required = true } = options;

  if (!date) {
    return {
      isValid: !required,
      error: required ? "La date est requise" : null,
    };
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: "Date invalide" };
  }

  if (min && dateObj < new Date(min)) {
    return { isValid: false, error: "La date est trop ancienne" };
  }

  if (max && dateObj > new Date(max)) {
    return { isValid: false, error: "La date est trop récente" };
  }

  return { isValid: true, error: null };
};

/**
 * Valide un champ requis
 * @param {any} value - Valeur à valider
 * @param {string} fieldName - Nom du champ
 * @returns {Object} { isValid, error }
 */
export const validateRequired = (value, fieldName = "Ce champ") => {
  const isValid = value !== null && value !== undefined && value !== "";
  return {
    isValid,
    error: isValid ? null : `${fieldName} est requis`,
  };
};

/**
 * Valide la longueur d'une chaîne
 * @param {string} value - Valeur à valider
 * @param {Object} options - Options de validation
 * @returns {Object} { isValid, error }
 */
export const validateLength = (value, options = {}) => {
  const { min, max, exact } = options;

  if (!value) return { isValid: true, error: null };

  const length = value.length;

  if (exact !== undefined && length !== exact) {
    return {
      isValid: false,
      error: `Doit contenir exactement ${exact} caractères`,
    };
  }

  if (min !== undefined && length < min) {
    return {
      isValid: false,
      error: `Doit contenir au moins ${min} caractères`,
    };
  }

  if (max !== undefined && length > max) {
    return { isValid: false, error: `Doit contenir au plus ${max} caractères` };
  }

  return { isValid: true, error: null };
};

/**
 * Valide un URL
 * @param {string} url - URL à valider
 * @returns {boolean} True si valide
 */
export const validateURL = (url) => {
  if (!url) return false;
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valide un numéro (entier ou décimal)
 * @param {string|number} value - Valeur à valider
 * @param {Object} options - Options de validation
 * @returns {Object} { isValid, error }
 */
export const validateNumber = (value, options = {}) => {
  const { integer = false, min, max } = options;

  if (!value && value !== 0) {
    return { isValid: false, error: "Valeur requise" };
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: "Doit être un nombre" };
  }

  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: "Doit être un nombre entier" };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `Doit être supérieur ou égal à ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Doit être inférieur ou égal à ${max}` };
  }

  return { isValid: true, error: null };
};

/**
 * Valide un formulaire complet
 * @param {Object} data - Données du formulaire
 * @param {Object} rules - Règles de validation
 * @returns {Object} { isValid, errors }
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    // Required
    if (rule.required) {
      const result = validateRequired(value, rule.label || field);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        return;
      }
    }

    // Email
    if (rule.email && value) {
      if (!validateEmail(value)) {
        errors[field] = "Email invalide";
        isValid = false;
        return;
      }
    }

    // Phone
    if (rule.phone && value) {
      if (!validatePhone(value)) {
        errors[field] = "Numéro de téléphone invalide";
        isValid = false;
        return;
      }
    }

    // Length
    if (rule.minLength || rule.maxLength) {
      const result = validateLength(value, {
        min: rule.minLength,
        max: rule.maxLength,
      });
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        return;
      }
    }

    // Custom validator
    if (rule.custom && value) {
      const result = rule.custom(value);
      if (!result) {
        errors[field] = rule.message || "Valeur invalide";
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};
