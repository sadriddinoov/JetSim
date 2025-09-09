import { useTranslation } from "react-i18next"
import Bottom from "../../layouts/Bottom/Bottom"
import Navbar from "../../layouts/Navbar/Navbar"
import { ASSETS } from "../../assets"
import './How.css'


const How = () => {
    const { t } = useTranslation()
    return (
        <div className="min-h-screen">
           <Navbar/>
           <div className="container how-container">
            <h1 className="how-heading">{t("how.title")}</h1>

            <div className="how-wrapper">
                <div className="how-item">
                    <div className="how-span">
                        1
                    </div>

                    <h2 className="how-item-h">
                        {t("how.how1-h")}
                    </h2>

                    <p className="how-item-p">
                    {t("how.how1-t")}
                    </p>

                    <h2 className="how-item-h">
                        {t("how.how1-s")}
                    </h2>
                </div>

                <img src={ASSETS.arrow} alt="" />

                <div className="how-item">
                    <div className="how-span">
                        2
                    </div>

                    <h2 className="how-item-h">
                        {t("how.how2-h")}
                    </h2>

                    <p className="how-item-p">
                    {t("how.how2-t")}
                    </p>

                    <h2 className="how-item-h">
                        {t("how.how2-s")}
                    </h2>
                </div>

                <img src={ASSETS.arrow} alt="" />

                <div className="how-item">
                    <div className="how-span">
                        3
                    </div>

                    <h2 className="how-item-h">
                        {t("how.how3-h")}
                    </h2>

                    <p className="how-item-p">
                    {t("how.how3-t")}
                    </p>

                    <h2 className="how-item-h">
                        {t("how.how3-s")}
                    </h2>
                </div>
            </div>
           </div>
           <Bottom/>
        </div>
    )
}

export default How