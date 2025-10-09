/**
 * Composant Header réutilisable
 * Header standard pour tous les écrans
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import SIZES from "../../constants/sizes";

const Header = ({
  title,
  onBack,
  rightComponent,
  rightIcon,
  onRightPress,
  showBack = true,
  backgroundColor = COLORS.surface,
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      {/* Bouton retour */}
      <View style={styles.leftContainer}>
        {showBack && onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons
              name="arrow-back"
              size={SIZES.icon.md}
              color={COLORS.text}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Titre */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Bouton droit ou composant custom */}
      <View style={styles.rightContainer}>
        {rightComponent ||
          (rightIcon && onRightPress ? (
            <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
              <Ionicons
                name={rightIcon}
                size={SIZES.icon.md}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          ) : null)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding.md,
    paddingTop: 40,
    paddingBottom: SIZES.padding.md,
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: COLORS.borderLight,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  title: {
    fontSize: SIZES.font.lg,
    fontWeight: "bold",
    color: COLORS.text,
  },
  iconButton: {
    padding: SIZES.padding.xs,
  },
});

export default Header;
