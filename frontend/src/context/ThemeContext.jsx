import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({
    themeMode: "light",
    toggleTheme: () => {},
});

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'light');
    
    const toggleTheme = () => {
        setThemeMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light"
            localStorage.setItem('themeMode',newMode)
            return newMode
        });
    };

    return (
        <ThemeContext.Provider value={{themeMode,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
