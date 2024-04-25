import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({
    themeMode: "light",
    toggleTheme: () => {},
});

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState("light");
    
    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{themeMode,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
