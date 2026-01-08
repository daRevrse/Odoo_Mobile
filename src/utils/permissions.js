import configService from "../services/configService";

/**
 * Permissions disponibles par module
 */
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  EXPORT: "export",
  ADMIN: "admin",
};

/**
 * Vérifier si un module est accessible
 * @param {string} moduleName - Nom du module (ex: "contacts", "ventes")
 * @returns {Promise<boolean>} True si le module est accessible
 */
export const canAccessModule = async (moduleName) => {
  try {
    const isEnabled = await configService.isModuleEnabled(moduleName);
    return isEnabled;
  } catch (error) {
    console.error("Erreur lors de la vérification d'accès au module:", error);
    return false;
  }
};

/**
 * Vérifier si l'utilisateur a une permission spécifique sur un module
 * @param {string} moduleName - Nom du module
 * @param {string} permission - Permission à vérifier ("read", "write", "delete")
 * @returns {Promise<boolean>} True si l'utilisateur a la permission
 */
export const hasPermission = async (moduleName, permission) => {
  try {
    // Vérifier d'abord si le module est activé
    const isModuleEnabled = await canAccessModule(moduleName);

    if (!isModuleEnabled) {
      return false;
    }

    // Récupérer les permissions du module
    const permissions = await configService.getModulePermissions(moduleName);

    // Vérifier si la permission est dans la liste
    return permissions.includes(permission);
  } catch (error) {
    console.error("Erreur lors de la vérification de permission:", error);
    return false;
  }
};

/**
 * Vérifier si l'utilisateur peut lire les données d'un module
 * @param {string} moduleName - Nom du module
 * @returns {Promise<boolean>} True si lecture autorisée
 */
export const canRead = async (moduleName) => {
  return await hasPermission(moduleName, PERMISSIONS.READ);
};

/**
 * Vérifier si l'utilisateur peut écrire dans un module
 * @param {string} moduleName - Nom du module
 * @returns {Promise<boolean>} True si écriture autorisée
 */
export const canWrite = async (moduleName) => {
  return await hasPermission(moduleName, PERMISSIONS.WRITE);
};

/**
 * Vérifier si l'utilisateur peut supprimer dans un module
 * @param {string} moduleName - Nom du module
 * @returns {Promise<boolean>} True si suppression autorisée
 */
export const canDelete = async (moduleName) => {
  return await hasPermission(moduleName, PERMISSIONS.DELETE);
};

/**
 * Vérifier si l'utilisateur peut exporter des données
 * @param {string} moduleName - Nom du module
 * @returns {Promise<boolean>} True si export autorisé
 */
export const canExport = async (moduleName) => {
  return await hasPermission(moduleName, PERMISSIONS.EXPORT);
};

/**
 * Vérifier si l'utilisateur a les droits admin sur un module
 * @param {string} moduleName - Nom du module
 * @returns {Promise<boolean>} True si admin autorisé
 */
export const canAdmin = async (moduleName) => {
  return await hasPermission(moduleName, PERMISSIONS.ADMIN);
};

/**
 * Récupérer toutes les permissions d'un module
 * @param {string} moduleName - Nom du module
 * @returns {Promise<Array>} Liste des permissions
 */
export const getModulePermissions = async (moduleName) => {
  try {
    return await configService.getModulePermissions(moduleName);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des permissions du module:",
      error
    );
    return [];
  }
};

/**
 * Vérifier si l'utilisateur a toutes les permissions spécifiées
 * @param {string} moduleName - Nom du module
 * @param {Array<string>} requiredPermissions - Liste des permissions requises
 * @returns {Promise<boolean>} True si toutes les permissions sont présentes
 */
export const hasAllPermissions = async (moduleName, requiredPermissions) => {
  try {
    const permissions = await getModulePermissions(moduleName);

    // Vérifier que toutes les permissions requises sont présentes
    return requiredPermissions.every((perm) => permissions.includes(perm));
  } catch (error) {
    console.error("Erreur lors de la vérification des permissions:", error);
    return false;
  }
};

/**
 * Vérifier si l'utilisateur a au moins une des permissions spécifiées
 * @param {string} moduleName - Nom du module
 * @param {Array<string>} requiredPermissions - Liste des permissions requises
 * @returns {Promise<boolean>} True si au moins une permission est présente
 */
export const hasAnyPermission = async (moduleName, requiredPermissions) => {
  try {
    const permissions = await getModulePermissions(moduleName);

    // Vérifier qu'au moins une permission requise est présente
    return requiredPermissions.some((perm) => permissions.includes(perm));
  } catch (error) {
    console.error("Erreur lors de la vérification des permissions:", error);
    return false;
  }
};

/**
 * Vérifier une permission globale (non liée à un module)
 * @param {string} permissionKey - Clé de la permission (ex: "can_export_data")
 * @returns {Promise<boolean>} True si la permission est accordée
 */
export const hasGlobalPermission = async (permissionKey) => {
  try {
    const config = await configService.getStoredConfig();

    if (!config || !config.user_permissions) {
      return false;
    }

    return config.user_permissions[permissionKey] === true;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de permission globale:",
      error
    );
    return false;
  }
};

/**
 * Vérifier si l'utilisateur peut accéder à l'admin
 * @returns {Promise<boolean>} True si accès admin autorisé
 */
export const canAccessAdmin = async () => {
  return await hasGlobalPermission("can_access_admin");
};

/**
 * Vérifier si l'utilisateur peut exporter des données globalement
 * @returns {Promise<boolean>} True si export autorisé
 */
export const canExportData = async () => {
  return await hasGlobalPermission("can_export_data");
};

/**
 * Vérifier si l'utilisateur peut supprimer des enregistrements globalement
 * @returns {Promise<boolean>} True si suppression autorisée
 */
export const canDeleteRecords = async () => {
  return await hasGlobalPermission("can_delete_records");
};

/**
 * Hook utilitaire pour vérifier les permissions dans les composants
 * @param {string} moduleName - Nom du module
 * @returns {Object} Objet avec les fonctions de vérification de permissions
 *
 * @example
 * const permissions = usePermissions("contacts");
 * if (await permissions.canWrite()) {
 *   // Afficher le bouton d'édition
 * }
 */
export const usePermissions = (moduleName) => {
  return {
    canRead: () => canRead(moduleName),
    canWrite: () => canWrite(moduleName),
    canDelete: () => canDelete(moduleName),
    canExport: () => canExport(moduleName),
    canAdmin: () => canAdmin(moduleName),
    getPermissions: () => getModulePermissions(moduleName),
    hasAll: (permissions) => hasAllPermissions(moduleName, permissions),
    hasAny: (permissions) => hasAnyPermission(moduleName, permissions),
  };
};

/**
 * Formater une liste de permissions pour l'affichage
 * @param {Array<string>} permissions - Liste des permissions
 * @returns {string} Permissions formatées (ex: "Lecture, Écriture")
 */
export const formatPermissions = (permissions) => {
  const labels = {
    read: "Lecture",
    write: "Écriture",
    delete: "Suppression",
    export: "Export",
    admin: "Administration",
  };

  return permissions.map((perm) => labels[perm] || perm).join(", ");
};
