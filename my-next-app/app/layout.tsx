"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect, useMemo } from "react";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          minHeight: "100vh",
          overflowY: "auto", // ✅ Allows scrolling
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ flex: 1 }}>{children}</div> {/* ✅ Ensures page content doesn't block scrolling */}
        </ThemeProvider>
      </body>
    </html>
  );
}
