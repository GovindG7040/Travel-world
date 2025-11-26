import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: "transparent",
        border: "none",
        fontSize: "1.4rem",
        cursor: "pointer"
      }}
    >
      {theme === "light" ? (
        <i className="ri-moon-line"></i>
      ) : (
        <i className="ri-sun-line"></i>
      )}
    </button>
  );
};

export default ThemeToggle;
