import { useState, useEffect, useRef } from "react";
import { ASSETS } from "../../assets";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { APP_ROUTES } from "../../router/path";
import "./Navbar.css";
import ModalLayout from "../Modal/Modal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ru", label: "Ру" },
    { code: "en", label: "En" },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === APP_ROUTES.AUTH) {
      setIsMenuOpen(false);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <header className="header">
      <div className="container">
        <div className="header-container">
          <div className="header-left">
            <a href={APP_ROUTES.HOME}>
              <img src={ASSETS.logo} alt="logo" className="header-logo" />
            </a>
            <div className="header-nav">
              <a className="header-link" href={APP_ROUTES.HOME}>
                {t("nav.all")}
              </a>
              <a className="header-link" href={APP_ROUTES.HOW_WORKS}>
                {t("nav.how")}
              </a>
              <a className="header-link" href={APP_ROUTES.FAQ}>
                F.A.Q
              </a>
              <a className="header-link" href={APP_ROUTES.ABOUT}>
                {t("nav.about")}
              </a>
            </div>
            <button
              className="burger-menu"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                console.log("Menu toggled:", !isMenuOpen);
              }}
            >
              ☰
            </button>
          </div>
          <div className="header-right">
            {isAuthenticated && (
              <div className="header-btn">
                <p className="header-text">{t("nav.korzina")}</p>
                <div className="header-span">12</div>
              </div>
            )}
            {window.location.pathname !== APP_ROUTES.AUTH && (
              <div onClick={handleOpenModal} className="header-btn">
                <p className="header-text">{t("nav.login")}</p>
              </div>
            )}
            <div className="header-btn language-btn">
              <select
                value={currentLang.code}
                onChange={changeLanguage}
                className="language-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                className="mobile-menu"
                ref={menuRef}
              >
                <button className="close-btn" onClick={handleCloseMenu}>
                  ×
                </button>
                <div className="mobile-menu-content">
                  <div className="header-nav">
                    <a className="header-link" href={APP_ROUTES.HOME}>
                      {t("nav.all")}
                    </a>
                    <a className="header-link" href={APP_ROUTES.HOW_WORKS}>
                      {t("nav.how")}
                    </a>
                    <a className="header-link" href={APP_ROUTES.FAQ}>
                      F.A.Q
                    </a>
                    <a className="header-link" href={APP_ROUTES.ABOUT}>
                      {t("nav.about")}
                    </a>
                  </div>
                  <div className="header-right">
                    {isAuthenticated && (
                      <div className="header-btn">
                        <p className="header-text">{t("nav.korzina")}</p>
                        <div className="header-span">12</div>
                      </div>
                    )}
                    <div className="header-btn" onClick={handleOpenModal}>
                      <p className="header-text">{t("nav.login")}</p>
                    </div>
                    <div className="header-btn language-btn">
                      <select
                        value={currentLang.code}
                        onChange={changeLanguage}
                        className="language-select"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <ModalLayout
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;