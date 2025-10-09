/**
 * Palette de couleurs de l'application
 * Utilisée pour garantir la cohérence visuelle
 */

const COLORS = {
  // Couleurs principales
  primary: "#990000",
  primaryLight: "#CC0000",
  primaryDark: "#660000",
  primaryOpacity: (opacity) => `rgba(153, 0, 0, ${opacity})`,

  // Couleurs secondaires
  secondary: "#F98715",
  secondaryLight: "#FFB84D",
  secondaryDark: "#C66A00",

  // Couleurs de fond
  background: "#F8F9FA",
  backgroundDark: "#E8E8E8",
  surface: "#FFFFFF",
  surfaceDark: "#F5F5F5",

  // Couleurs de texte
  text: "#333333",
  textSecondary: "#666666",
  textLight: "#999999",
  textWhite: "#FFFFFF",
  textDisabled: "#CCCCCC",

  // Couleurs de bordure
  border: "#E8E8E8",
  borderLight: "#F0F0F0",
  borderDark: "#CCCCCC",

  // Statuts
  success: "#27AE60",
  successLight: "#D5F4E6",
  warning: "#F39C12",
  warningLight: "#FCF3CF",
  error: "#E74C3C",
  errorLight: "#FADBD8",
  info: "#3498DB",
  infoLight: "#D6EAF8",

  // Couleurs spécifiques aux modules
  modules: {
    messages: "#F98715",
    ventes: "#256572",
    contacts: "#975185",
    calendrier: "#1ED0C0",
    absences: "#975185",
    notes: "#326590",
    documents: "#FA6218",
    employes: "#F98715",
    projet: "#991B1F",
    crm: "#256572",
    stock: "#975185",
    presences: "#326590",
    conges: "#1ED0C0",
  },

  // Types de contacts/clients
  types: {
    client: "#3498DB",
    clientLight: "#D6EAF8",
    fournisseur: "#27AE60",
    fournisseurLight: "#D5F4E6",
    partenaire: "#F39C12",
    partenaireLight: "#FCF3CF",
    autre: "#95A5A6",
    autreLight: "#ECF0F1",
  },

  // Couleurs des graphiques
  charts: [
    "#990000",
    "#F98715",
    "#3498DB",
    "#27AE60",
    "#F39C12",
    "#E74C3C",
    "#9B59B6",
    "#1ABC9C",
    "#34495E",
    "#16A085",
  ],

  // Couleurs utilitaires
  transparent: "transparent",
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.5)",
  white: "#FFFFFF",
  black: "#000000",

  // Dégradés
  gradients: {
    primary: ["#990000", "#CC0000"],
    success: ["#27AE60", "#2ECC71"],
    info: ["#3498DB", "#5DADE2"],
    warning: ["#F39C12", "#F8C471"],
  },
};

export default COLORS;
