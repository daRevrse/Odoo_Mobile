/**
 * Configuration par défaut de l'application
 * Utilisée comme fallback si la config Odoo n'est pas disponible
 */

export const DEFAULT_CONFIG = {
  branding: {
    app_name: "Odoo Mobile BS",
    logo_url: null,
    primary_color: "#990000",
    secondary_color: "#333333",
  },
  modules: {
    messages: {
      enabled: true,
      permissions: ["read", "write", "delete"],
      icon: "chatbubble-ellipses-outline",
      iconColor: "#F98715",
      label: "Messages",
      screen: "Messages",
    },
    ventes: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "pricetag-outline",
      iconColor: "#256572",
      label: "Ventes",
      screen: "Ventes",
    },
    contacts: {
      enabled: true,
      permissions: ["read", "write", "delete"],
      icon: "people-outline",
      iconColor: "#975185",
      label: "Contacts",
      screen: "Contacts",
    },
    calendrier: {
      enabled: true,
      permissions: ["read", "write", "delete"],
      icon: "calendar-outline",
      iconColor: "#1ED0C0",
      label: "Calendrier",
      screen: "Calendrier",
    },
    absences: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "time-outline",
      iconColor: "#975185",
      label: "Absences",
      screen: "Absences",
    },
    notes: {
      enabled: true,
      permissions: ["read", "write", "delete"],
      icon: "create-outline",
      iconColor: "#326590",
      label: "Notes",
      screen: "Notes",
    },
    documents: {
      enabled: true,
      permissions: ["read", "write", "delete"],
      icon: "folder-outline",
      iconColor: "#FA6218",
      label: "Documents",
      screen: "Documents",
    },
    employes: {
      enabled: true,
      permissions: ["read"],
      icon: "person-outline",
      iconColor: "#F98715",
      label: "Employés",
      screen: "Employés",
    },
    projet: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "settings-outline",
      iconColor: "#991B1F",
      label: "Projet",
      screen: "Projet",
    },
    crm: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "hand-left-outline",
      iconColor: "#256572",
      label: "CRM",
      screen: "CRM",
    },
    stock: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "cube-outline",
      iconColor: "#975185",
      label: "Stock",
      screen: "Stock",
    },
    presences: {
      enabled: true,
      permissions: ["read"],
      icon: "eye-outline",
      iconColor: "#326590",
      label: "Présences",
      screen: "Présences",
    },
    conges: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "person-add-outline",
      iconColor: "#1ED0C0",
      label: "Congés",
      screen: "Congés",
    },
  },
  settings: {
    language: "fr_FR",
    timezone: "Africa/Lome",
    date_format: "DD/MM/YYYY",
    currency: "FCFA",
  },
  user_permissions: {
    can_access_admin: false,
    can_export_data: true,
    can_delete_records: false,
  },
};

/**
 * Configuration de test pour développement
 * Simule une config reçue depuis le module Odoo
 */
export const TEST_CONFIG_1 = {
  branding: {
    app_name: "TechCorp Pro",
    logo_url: "https://i.pravatar.cc/300",
    primary_color: "#2563EB",
    secondary_color: "#1E40AF",
  },
  modules: {
    messages: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "chatbubble-ellipses-outline",
      iconColor: "#2563EB",
      label: "Messages",
      screen: "Messages",
    },
    ventes: {
      enabled: true,
      permissions: ["read"],
      icon: "pricetag-outline",
      iconColor: "#10B981",
      label: "Ventes",
      screen: "Ventes",
    },
    contacts: {
      enabled: true,
      permissions: ["read", "write", "delete"],
      icon: "people-outline",
      iconColor: "#8B5CF6",
      label: "Contacts",
      screen: "Contacts",
    },
    calendrier: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "calendar-outline",
      iconColor: "#F59E0B",
      label: "Calendrier",
      screen: "Calendrier",
    },
    // Modules désactivés
    absences: { enabled: false },
    notes: { enabled: false },
    documents: {
      enabled: true,
      permissions: ["read"],
      icon: "folder-outline",
      iconColor: "#EF4444",
      label: "Documents",
      screen: "Documents",
    },
    employes: { enabled: false },
    projet: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "settings-outline",
      iconColor: "#06B6D4",
      label: "Projet",
      screen: "Projet",
    },
    crm: { enabled: false },
    stock: { enabled: false },
    presences: { enabled: false },
    conges: { enabled: false },
  },
  settings: {
    language: "fr_FR",
    timezone: "Africa/Lome",
    date_format: "DD/MM/YYYY",
    currency: "FCFA",
  },
  user_permissions: {
    can_access_admin: false,
    can_export_data: true,
    can_delete_records: true,
  },
};

/**
 * Configuration de test 2 - Minimal
 */
export const TEST_CONFIG_2 = {
  branding: {
    app_name: "StartUp Mobile",
    logo_url: null,
    primary_color: "#10B981",
    secondary_color: "#059669",
  },
  modules: {
    messages: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "chatbubble-ellipses-outline",
      iconColor: "#10B981",
      label: "Messages",
      screen: "Messages",
    },
    contacts: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "people-outline",
      iconColor: "#10B981",
      label: "Contacts",
      screen: "Contacts",
    },
    calendrier: {
      enabled: true,
      permissions: ["read", "write"],
      icon: "calendar-outline",
      iconColor: "#10B981",
      label: "Calendrier",
      screen: "Calendrier",
    },
    // Tous les autres modules désactivés
    ventes: { enabled: false },
    absences: { enabled: false },
    notes: { enabled: false },
    documents: { enabled: false },
    employes: { enabled: false },
    projet: { enabled: false },
    crm: { enabled: false },
    stock: { enabled: false },
    presences: { enabled: false },
    conges: { enabled: false },
  },
  settings: {
    language: "fr_FR",
    timezone: "Africa/Abidjan",
    date_format: "DD/MM/YYYY",
    currency: "FCFA",
  },
  user_permissions: {
    can_access_admin: false,
    can_export_data: false,
    can_delete_records: false,
  },
};
