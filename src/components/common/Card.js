/**
 * Composant Card réutilisable
 * Conteneur avec ombre et bordure arrondie
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import SIZES from "../../constants/sizes";

const Card = ({
  children,
  onPress,
  style,
  variant = "elevated", // elevated, flat, outlined
  padding = true,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  const cardStyles = [
    styles.card,
    styles[variant],
    !padding && styles.noPadding,
    style,
  ];

  return (
    <Container
      style={cardStyles}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    marginBottom: SIZES.margin.md,
  },
  elevated: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flat: {
    backgroundColor: COLORS.surfaceDark,
  },
  outlined: {
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
  },
  noPadding: {
    padding: 0,
  },
});

export default Card;
