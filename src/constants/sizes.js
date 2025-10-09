/**
 * Tailles et espacements standardisés
 * Pour garantir la cohérence des espacements et tailles
 */

const SIZES = {
  // Tailles de base
  base: 8,

  // Espacements (multiples de 8)
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  // Tailles de police
  font: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    title: 24,
    header: 20,
  },

  // Hauteurs des éléments
  height: {
    input: 50,
    button: 50,
    header: 60,
    tabBar: 60,
    card: 100,
  },

  // Largeurs
  width: {
    full: "100%",
    half: "48%",
    third: "32%",
    quarter: "23%",
  },

  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 30,
    circle: 9999,
  },

  // Border width
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
  },

  // Tailles des icônes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 60,
  },

  // Tailles des avatars
  avatar: {
    xs: 32,
    sm: 40,
    md: 50,
    lg: 60,
    xl: 80,
    xxl: 100,
    xxxl: 120,
  },

  // Élévation (shadow)
  elevation: {
    none: 0,
    low: 2,
    medium: 4,
    high: 8,
  },

  // Opacité
  opacity: {
    disabled: 0.5,
    semiTransparent: 0.7,
    mostlyTransparent: 0.3,
  },

  // Line height
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

export default SIZES;
