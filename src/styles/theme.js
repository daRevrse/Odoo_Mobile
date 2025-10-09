/**
 * Thème principal de l'application
 * Combine les couleurs, tailles et styles globaux
 */

import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";
import SIZES from "../constants/sizes";

const THEME = {
  colors: COLORS,
  sizes: SIZES,

  // Styles de texte réutilisables
  text: {
    h1: {
      fontSize: SIZES.font.xxl,
      fontWeight: "bold",
      color: COLORS.text,
      lineHeight: SIZES.font.xxl * SIZES.lineHeight.tight,
    },
    h2: {
      fontSize: SIZES.font.xl,
      fontWeight: "bold",
      color: COLORS.text,
      lineHeight: SIZES.font.xl * SIZES.lineHeight.tight,
    },
    h3: {
      fontSize: SIZES.font.lg,
      fontWeight: "600",
      color: COLORS.text,
      lineHeight: SIZES.font.lg * SIZES.lineHeight.tight,
    },
    body: {
      fontSize: SIZES.font.md,
      color: COLORS.text,
      lineHeight: SIZES.font.md * SIZES.lineHeight.normal,
    },
    bodySecondary: {
      fontSize: SIZES.font.md,
      color: COLORS.textSecondary,
      lineHeight: SIZES.font.md * SIZES.lineHeight.normal,
    },
    caption: {
      fontSize: SIZES.font.sm,
      color: COLORS.textLight,
      lineHeight: SIZES.font.sm * SIZES.lineHeight.normal,
    },
    small: {
      fontSize: SIZES.font.xs,
      color: COLORS.textLight,
      lineHeight: SIZES.font.xs * SIZES.lineHeight.normal,
    },
    button: {
      fontSize: SIZES.font.md,
      fontWeight: "600",
      color: COLORS.textWhite,
    },
    label: {
      fontSize: SIZES.font.sm,
      fontWeight: "600",
      color: COLORS.text,
    },
    error: {
      fontSize: SIZES.font.sm,
      color: COLORS.error,
    },
  },

  // Styles de shadow
  shadow: {
    small: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Styles globaux communs
export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding.md,
  },
  surface: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    ...THEME.shadow.small,
  },

  // Flex helpers
  row: {
    flexDirection: "row",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Headers
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.md,
    paddingTop: 40,
    paddingBottom: SIZES.padding.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: SIZES.font.lg,
    fontWeight: "bold",
    color: COLORS.text,
  },

  // Sections
  section: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.padding.md,
    marginBottom: SIZES.margin.lg,
  },
  sectionTitle: {
    fontSize: SIZES.font.sm,
    fontWeight: "600",
    color: COLORS.textLight,
    paddingTop: SIZES.padding.md,
    paddingBottom: SIZES.padding.md,
    letterSpacing: SIZES.letterSpacing.wide,
  },

  // Inputs
  input: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.md,
    fontSize: SIZES.font.md,
    color: COLORS.text,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },

  // Buttons
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding.md,
    paddingHorizontal: SIZES.padding.lg,
    borderRadius: SIZES.radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...THEME.shadow.medium,
  },
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.borderDark,
    ...THEME.shadow.none,
  },
  buttonText: {
    color: COLORS.textWhite,
    fontSize: SIZES.font.md,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: COLORS.primary,
  },

  // Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    marginBottom: SIZES.margin.md,
    ...THEME.shadow.small,
  },

  // Badges
  badge: {
    paddingHorizontal: SIZES.padding.sm,
    paddingVertical: SIZES.padding.xs,
    borderRadius: SIZES.radius.lg,
  },
  badgeText: {
    fontSize: SIZES.font.xs,
    fontWeight: "600",
  },

  // Dividers
  divider: {
    height: SIZES.borderWidth.thin,
    backgroundColor: COLORS.borderLight,
  },
  dividerVertical: {
    width: SIZES.borderWidth.thin,
    backgroundColor: COLORS.borderLight,
  },

  // Spacing
  mt_xs: { marginTop: SIZES.margin.xs },
  mt_sm: { marginTop: SIZES.margin.sm },
  mt_md: { marginTop: SIZES.margin.md },
  mt_lg: { marginTop: SIZES.margin.lg },
  mt_xl: { marginTop: SIZES.margin.xl },

  mb_xs: { marginBottom: SIZES.margin.xs },
  mb_sm: { marginBottom: SIZES.margin.sm },
  mb_md: { marginBottom: SIZES.margin.md },
  mb_lg: { marginBottom: SIZES.margin.lg },
  mb_xl: { marginBottom: SIZES.margin.xl },

  p_xs: { padding: SIZES.padding.xs },
  p_sm: { padding: SIZES.padding.sm },
  p_md: { padding: SIZES.padding.md },
  p_lg: { padding: SIZES.padding.lg },
  p_xl: { padding: SIZES.padding.xl },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SIZES.padding.xxl,
  },
  emptyText: {
    marginTop: SIZES.margin.md,
    fontSize: SIZES.font.md,
    color: COLORS.textLight,
  },
});

export default THEME;
