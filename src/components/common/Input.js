/**
 * Composant Input réutilisable
 * Champ de saisie avec label, icône et validation
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import SIZES from "../../constants/sizes";

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  secureTextEntry,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  required = false,
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles = [styles.container, style];

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    !editable && styles.inputDisabled,
  ];

  return (
    <View style={containerStyles}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input container */}
      <View style={inputContainerStyles}>
        {/* Left icon */}
        {icon && (
          <Ionicons
            name={icon}
            size={SIZES.icon.sm}
            color={
              error
                ? COLORS.error
                : isFocused
                ? COLORS.primary
                : COLORS.textLight
            }
            style={styles.leftIcon}
          />
        )}

        {/* Text input */}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Right icon */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={SIZES.icon.sm}
              color={COLORS.textLight}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin.lg,
  },
  label: {
    fontSize: SIZES.font.sm,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.margin.sm,
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceDark,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.padding.md,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputDisabled: {
    backgroundColor: COLORS.backgroundDark,
    opacity: SIZES.opacity.disabled,
  },
  leftIcon: {
    marginRight: SIZES.margin.sm,
  },
  rightIcon: {
    marginLeft: SIZES.margin.sm,
  },
  input: {
    flex: 1,
    fontSize: SIZES.font.md,
    paddingVertical: SIZES.padding.md,
    color: COLORS.text,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: SIZES.padding.md,
  },
  errorText: {
    fontSize: SIZES.font.xs,
    color: COLORS.error,
    marginTop: SIZES.margin.xs,
  },
});

export default Input;
