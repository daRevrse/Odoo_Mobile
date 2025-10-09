/**
 * Composant Button réutilisable
 * Bouton personnalisable avec différents variants
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import SIZES from "../../constants/sizes";

const Button = ({
  title,
  onPress,
  variant = "primary", // primary, secondary, outline, ghost, danger
  size = "medium", // small, medium, large
  icon,
  iconPosition = "left", // left, right
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  const iconSize =
    size === "small"
      ? SIZES.icon.sm
      : size === "large"
      ? SIZES.icon.md
      : SIZES.icon.sm;
  const iconColor =
    variant === "primary" || variant === "danger"
      ? COLORS.textWhite
      : COLORS.primary;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.iconLeft}
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZES.radius.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },

  // Variants
  button_primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  button_secondary: {
    backgroundColor: COLORS.secondary,
  },
  button_outline: {
    backgroundColor: COLORS.transparent,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.primary,
  },
  button_ghost: {
    backgroundColor: COLORS.transparent,
  },
  button_danger: {
    backgroundColor: COLORS.error,
  },

  // Sizes
  button_small: {
    paddingVertical: SIZES.padding.sm,
    paddingHorizontal: SIZES.padding.md,
  },
  button_medium: {
    paddingVertical: SIZES.padding.md,
    paddingHorizontal: SIZES.padding.lg,
  },
  button_large: {
    paddingVertical: SIZES.padding.lg,
    paddingHorizontal: SIZES.padding.xl,
  },

  // Text
  text: {
    fontWeight: "600",
  },
  text_primary: {
    color: COLORS.textWhite,
  },
  text_secondary: {
    color: COLORS.textWhite,
  },
  text_outline: {
    color: COLORS.primary,
  },
  text_ghost: {
    color: COLORS.primary,
  },
  text_danger: {
    color: COLORS.textWhite,
  },
  text_small: {
    fontSize: SIZES.font.sm,
  },
  text_medium: {
    fontSize: SIZES.font.md,
  },
  text_large: {
    fontSize: SIZES.font.lg,
  },

  // Disabled
  buttonDisabled: {
    backgroundColor: COLORS.borderDark,
    shadowOpacity: 0,
    elevation: 0,
  },
  textDisabled: {
    color: COLORS.textLight,
  },

  // Icons
  iconLeft: {
    marginRight: SIZES.margin.sm,
  },
  iconRight: {
    marginLeft: SIZES.margin.sm,
  },
});

export default Button;
