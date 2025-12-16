export const createSelectStyles = (config = {}) => {
  const {
    isDarkMode = typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
    menuPortalZIndex = 999999,
    controlMinHeight = 42,
    controlBorderRadius = 8,
    controlBorderColorLight = "#d1d5db",
    controlBorderColorDark = "oklch(44.6% 0.043 257.281)",
    controlBorderFocusColorLight = "#94a3b8",
    controlBorderFocusColorDark = "#64748b",
    controlBgLight = "#ffffff",
    controlBgDark = "rgba(15, 23, 42, 0.85)",
    controlFocusShadowLight,
    controlFocusShadowDark,
    placeholderColorLight = "#6b7280",
    placeholderColorDark = "#94a3b8",
    optionHoverLight = "#f3f4f6",
    optionHoverDark = "#1e293b",
    menuBgLight = "#ffffff",
    menuBgDark = "rgba(15, 23, 42, 0.95)",
    menuBorderColorLight = "#e5e7eb",
    menuBorderColorDark = "#334155",
    textColorLight = "#111827",
    textColorDark = "#e2e8f0",
    includeMultiValue = false,
    multiValueBgLight = "#e2e8f0",
    multiValueBgDark = "#1e293b",
    multiValueTextColorLight = textColorLight,
    multiValueTextColorDark = textColorDark,
    multiValueBorderRadius,
    multiValuePadding,
    multiValueRemoveHoverBgLight = "#cbd5f5",
    multiValueRemoveHoverBgDark = "#334155",
    multiValueRemoveHoverTextLight = textColorLight,
    multiValueRemoveHoverTextDark = textColorDark,
    overrides = {},
  } = config;

  const resolvedDarkMode =
    typeof isDarkMode === "boolean"
      ? isDarkMode
      : typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

  const controlBorderColor = resolvedDarkMode
    ? controlBorderColorDark
    : controlBorderColorLight;
  const controlBorderFocusColor = resolvedDarkMode
    ? controlBorderFocusColorDark
    : controlBorderFocusColorLight;
  const controlBg = resolvedDarkMode ? controlBgDark : controlBgLight;
  const textColor = resolvedDarkMode ? textColorDark : textColorLight;
  const placeholderColor = resolvedDarkMode
    ? placeholderColorDark
    : placeholderColorLight;
  const optionHover = resolvedDarkMode ? optionHoverDark : optionHoverLight;
  const menuBg = resolvedDarkMode ? menuBgDark : menuBgLight;
  const menuBorderColor = resolvedDarkMode
    ? menuBorderColorDark
    : menuBorderColorLight;
  const focusShadow = resolvedDarkMode
    ? controlFocusShadowDark
    : controlFocusShadowLight;
  const multiValueBg = resolvedDarkMode ? multiValueBgDark : multiValueBgLight;
  const multiValueTextColor = resolvedDarkMode
    ? multiValueTextColorDark
    : multiValueTextColorLight;
  const multiValueRemoveHoverBg = resolvedDarkMode
    ? multiValueRemoveHoverBgDark
    : multiValueRemoveHoverBgLight;
  const multiValueRemoveHoverText = resolvedDarkMode
    ? multiValueRemoveHoverTextDark
    : multiValueRemoveHoverTextLight;

  const styles = {
    control: (base, state) => ({
      ...base,
      minHeight: controlMinHeight,
      borderRadius: controlBorderRadius,
      borderColor: state.isFocused
        ? controlBorderFocusColor
        : controlBorderColor,
      boxShadow:
        state.isFocused && typeof focusShadow === "string" && focusShadow.length
          ? focusShadow
          : "none",
      backgroundColor: controlBg,
      ":hover": { borderColor: controlBorderFocusColor },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 12px" }),
    placeholder: (base) => ({ ...base, color: placeholderColor }),
    singleValue: (base) => ({ ...base, color: textColor }),
    input: (base) => ({ ...base, color: textColor }),
    menu: (base) => ({
      ...base,
      zIndex: menuPortalZIndex,
      borderRadius: controlBorderRadius,
      overflow: "hidden",
      backgroundColor: menuBg,
      border: `1px solid ${menuBorderColor}`,
    }),
    menuPortal: (base) => ({ ...base, zIndex: menuPortalZIndex }),
    option: (base, state) => ({
      ...base,
      fontSize: 14,
      backgroundColor: state.isFocused ? optionHover : menuBg,
      color: textColor,
      ":active": {
        backgroundColor: optionHover,
      },
    }),
  };

  if (includeMultiValue) {
    styles.multiValue = (base) => ({
      ...base,
      backgroundColor: multiValueBg,
      ...(typeof multiValueBorderRadius === "number"
        ? { borderRadius: multiValueBorderRadius }
        : {}),
      ...(typeof multiValuePadding === "string"
        ? { padding: multiValuePadding }
        : {}),
    });
    styles.multiValueLabel = (base) => ({
      ...base,
      color: multiValueTextColor,
    });
    styles.multiValueRemove = (base) => ({
      ...base,
      color: multiValueTextColor,
      ":hover": {
        backgroundColor: multiValueRemoveHoverBg,
        color: multiValueRemoveHoverText,
      },
    });
  }

  return { ...styles, ...overrides };
};
