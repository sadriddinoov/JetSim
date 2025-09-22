import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../layouts/Navbar/Navbar";
import Bottom from "../../layouts/Bottom/Bottom";
import SimCard from "../../components/SimCard/SimCard";
import { MockSIms } from "../../data/sims";
import "./Home.css";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("global");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setSearchTerm("");
  };

  const categories = MockSIms[0].categories;

  const filteredCategories = categories
    .filter((category) => category.name === activeCategory)
    .map((category) => ({
      ...category,
      countries: category.countries.filter(
        (country) =>
          t(`sims.${country.name}`)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          t(`sims.${category.name}`)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.countries.length > 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container">
        <div className="content">
          <h1 className="title">{t("sims.title")}</h1>
          <p className="subtitle">{t("sims.subtitle")}</p>
          <p className="subtitle">{t("sims.subtitle2")}</p>
          <input
            type="text"
            placeholder={t(`sims.search_placeholder`)}
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={
                  activeCategory === category.name
                    ? "category-button active"
                    : "category-button"
                }
              >
                {t(`sims.${category.name}`)} {category.icon}
              </button>
            ))}
          </div>
          {filteredCategories.map((category) => (
            <div key={category.id} className="category-section">
              <div className="card-grid">
                {category.countries.map((country) => (
                  <SimCard
                    key={country.id}
                    flag={country.flag}
                    country={country.name}
                    plans={country.plans}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Bottom />
    </div>
  );
};

export default Home;
