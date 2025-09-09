import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./Modal.css";
import { ASSETS } from "../../assets";
import { APP_ROUTES } from "../../router/path";
import { ArrowLeftIcon } from "lucide-react";

interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLayout = ({ isOpen, onClose }: ModalLayoutProps) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(true);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(5);
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const otpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEmailModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
      if (
        isOtpModalOpen &&
        otpRef.current &&
        !otpRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isEmailModalOpen, isOtpModalOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsEmailModalOpen(true);
      setIsOtpModalOpen(false);
      resetModal();
    }
  }, [isOpen]);

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, 6);
    setGeneratedOtp(newOtp);
    setTimer(60);
    alert(newOtp);
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.includes("@")) {
      setIsEmailModalOpen(false);
      setIsOtpModalOpen(true);
      generateOtp();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6 && enteredOtp === generatedOtp) {
      localStorage.setItem("isAuthenticated", "true");
      onClose();
    } else if (attempts > 0) {
      setAttempts((prev) => prev - 1);
    }
    if (attempts === 0) {
      resetModal();
      onClose();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }

    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  const handleBackClick = () => {
    setIsEmailModalOpen(true);
    setIsOtpModalOpen(false);
  };

  const resetModal = () => {
    setOtp(new Array(6).fill(""));
    setAttempts(5);
    setTimer(0);
    setGeneratedOtp("");
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="modal-overlay"
        >
          {isEmailModalOpen && (
            <motion.div
              ref={modalRef}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-logo">
                <img src={ASSETS.loginlogo} alt="JetSIM Logo" />
              </div>
              <h3 className="modal-heading">{t("modal.login")}</h3>
              <form onSubmit={handleEmailSubmit}>
                <label>{t("modal.label")}</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="modal-accept"
                  type="submit"
                  disabled={!email.includes("@")}
                >
                  {t("modal.next")}
                </button>
              </form>
              <ul className="modal-list">
                <a href={APP_ROUTES.CONFIDENTIAL}>{t("modal.nav1")}</a>
                <a href={APP_ROUTES.OFERTA}>{t("modal.nav2")}</a>
                <a href={APP_ROUTES.USLOVIYA}>{t("modal.nav3")}</a>
                <a href={APP_ROUTES.RULE}>{t("modal.nav4")}</a>
              </ul>
            </motion.div>
          )}
          {isOtpModalOpen && (
            <motion.div
              ref={otpRef}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-logo">
                <img src={ASSETS.loginlogo} alt="JetSIM Logo" />
              </div>
              <div className="otp-header">
                <div className="back-button" onClick={handleBackClick}>
                  <ArrowLeftIcon style={{ color: "#FFFFFF" }} />
                </div>
                <h3 className="modal-heading">Регистрация/Авторизация → OTP</h3>
              </div>
              <p className="otp-sent-text">Код отправлен на {email}</p>
              <form onSubmit={handleOtpSubmit}>
                <div className="otp-inputs">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className={attempts < 5 ? "otp-error" : ""}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={generateOtp}
                  className="resend-button"
                  disabled={timer > 0}
                >
                  {timer > 0
                    ? `${t("modal.resend")} (${timer})`
                    : t("modal.resend")}
                </button>
                <button
                  className="modal-accept"
                  type="submit"
                  disabled={!isOtpComplete}
                >
                  {t("modal.accept")}
                </button>
              </form>
              {attempts < 5 && (
                <p className="otp-error-text">
                  {t("modal.wrong")} {attempts} {t("modal.attempts")}
                </p>
              )}
              {attempts === 0 && (
                <p className="otp-error-text">
                  {t("modal.redo")}
                </p>
              )}
              <ul className="modal-list">
                <a href={APP_ROUTES.CONFIDENTIAL}>{t("modal.nav1")}</a>
                <a href={APP_ROUTES.OFERTA}>{t("modal.nav2")}</a>
                <a href={APP_ROUTES.USLOVIYA}>{t("modal.nav3")}</a>
                <a href={APP_ROUTES.RULE}>{t("modal.nav4")}</a>
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalLayout;
