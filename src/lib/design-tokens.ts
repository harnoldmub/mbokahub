export const colors = {
  bg: {
    primary: "#0a0a0a",
    secondary: "#141414",
    tertiary: "#1f1f1f",
    elevated: "#262626",
  },
  accent: {
    red: "#e63946",
    orange: "#ff6b35",
    ember: "#ff9142",
    gold: "#f2b705",
  },
  text: {
    primary: "#ffffff",
    secondary: "#a1a1a1",
    muted: "#6b6b6b",
    inverse: "#0a0a0a",
  },
  border: {
    default: "rgba(255,255,255,0.08)",
    hover: "rgba(255,255,255,0.16)",
    accent: "rgba(230,57,70,0.4)",
  },
  status: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
} as const;

export const glow = {
  red: "0 0 40px rgba(230, 57, 70, 0.4)",
  orange: "0 0 40px rgba(255, 107, 53, 0.3)",
  gold: "0 0 30px rgba(242, 183, 5, 0.3)",
} as const;
