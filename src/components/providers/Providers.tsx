"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
