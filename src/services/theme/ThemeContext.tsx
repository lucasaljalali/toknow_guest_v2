import { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PaletteMode, useMediaQuery } from "@mui/material";
import { themeMode, user } from "../../store/signalsStore";

type Props = { children: React.ReactNode };

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#f0ad3b",
            light: "#f5b74d",
            dark: "#c0831a",
            hover: "red",
          },
          secondary: {
            main: "#fdc130",
            light: "#fdcb55",
          },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
          text: {
            primary: "#141414",
            secondary: "#333333",
            disabled: "#c3c3c3",
          },
          formLabelFocused: "red",
        }
      : {
          primary: {
            main: "#f0ad3b",
            light: "#f5b74d",
            dark: "#c0831a",
            hover: "red",
          },
          secondary: {
            main: "#fdc130",
            light: "#fdcb55",
          },
          background: {
            default: "#202020",
            paper: "#161616",
          },
          text: {
            primary: "#fff",
            secondary: "#ececec",
            disabled: "#6c6c6c",
          },
          formLabelFocused: "red",
        }),
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
        sizeSmall: {
          height: "2.5rem",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        sizeSmall: {
          height: "2.25rem",
          boxShadow: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px var(--background-color-primary) inset",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: "inherit",
          minHeight: "2.5rem",
          padding: "0.5rem 1rem",
        },
      },
    },
  },
});

export function ThemeContext({ children }: Props) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme(getDesignTokens(themeMode.value));

  useEffect(() => {
    // const userDefaultTheme = currentUser?.defaultTheme && currentUser.defaultTheme === Theme.DARK ? "dark" : "light";
    // if (userDefaultTheme) {
    //   setThemeMode(userDefaultTheme);
    //   return;
    // }

    if (prefersDarkMode) {
      themeMode.value = "dark";
      return;
    }

    themeMode.value = "light";
  }, [prefersDarkMode, user.value]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
