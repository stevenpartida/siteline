"use client";

import { createContext, useContext, useState } from "react";

type NavVisibilityContextValue = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

const NavVisibilityContext = createContext<NavVisibilityContextValue | null>(
  null,
);

export function NavVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hidden, setHidden] = useState(false);
  return (
    <NavVisibilityContext.Provider value={{ hidden, setHidden }}>
      {children}
    </NavVisibilityContext.Provider>
  );
}

export function useNavVisibility() {
  const ctx = useContext(NavVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useNavVisibility must be used within NavVisibilityProvider",
    );
  }
  return ctx;
}
