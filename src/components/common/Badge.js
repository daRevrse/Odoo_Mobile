/**
 * Composant Badge réutilisable
 * Badge pour statuts, types, etc.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import SIZES from "../../constants/sizes";

const Badge = ({
  text,
  variant = "primary", // primary, success, warning, error, info, custom
  size = "medium", // small, medium, large
  icon,
  customColor,
  style,
  textStyle,
}) => {
  const getColors = () => {
    if (customColor) {
      return {
        backgroundColor: `${customColor}20`,
        textColor: customColor,
      };
    }

    switch (variant) {
      case "success":
        return {
          backgroundColor: COLORS.successLight,
          textColor: COLORS.success,
        };
      case "warning":
        return {
          backgroundColor: COLORS.warningLight,
          textColor: COLORS.warning,
        };
      case "error":
        return { backgroundColor: COLORS.errorLight, textColor: COLORS.error };
      case "info":
        return { backgroundColor: COLORS.infoLight, textColor: COLORS.info };
      case "primary":
      default:
        return {
          backgroundColor: COLORS.primaryOpacity(0.2),
          textColor: COLORS.primary,
        };
    }
  };

  const colors = getColors();
  const iconSize = size === "small" ? 10 : size === "large" ? 14 : 12;

  const badgeStyles = [
    styles.badge,
    styles[`badge_${size}`],
    { backgroundColor: colors.backgroundColor },
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${size}`],
    { color: colors.textColor },
    textStyle,
  ];

  return (
    <View style={badgeStyles}>
      {icon && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={colors.textColor}
          style={styles.icon}
        />
      )}
      <Text style={textStyles}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZES.radius.lg,
    alignSelf: "flex-start",
  },
  badge_small: {
    paddingHorizontal: SIZES.padding.xs,
    paddingVertical: 2,
  },
  badge_medium: {
    paddingHorizontal: SIZES.padding.sm,
    paddingVertical: SIZES.padding.xs,
  },
  badge_large: {
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.sm,
  },
  text: {
    fontWeight: "600",
  },
  text_small: {
    fontSize: SIZES.font.xs - 1,
  },
  text_medium: {
    fontSize: SIZES.font.xs,
  },
  text_large: {
    fontSize: SIZES.font.sm,
  },
  icon: {
    marginRight: SIZES.margin.xs,
  },
});

export default Badge;
