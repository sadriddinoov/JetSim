import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCustomPost } from "../../hooks/useCustomPost";
import { setToken } from "../../config/api";
import { ASSETS } from "../../assets";
import { APP_ROUTES } from "../../router/path";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "react-toastify"; // Импортируем react-toastify
import "./Modal.css";

interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLayout: React.FC<ModalLayoutProps> = ({ isOpen, onClose }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(true);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const otpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Отображаем тосты при изменении error или success
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 3000 });
      // Сбрасываем error после показа тоста, чтобы избежать повторного отображения
      setTimeout(() => setError(""), 3500);
    }
    if (success) {
      toast.success(success, { position: "top-right", autoClose: 3000 });
      // Сбрасываем success после показа тоста
      setTimeout(() => setSuccess(""), 3500);
    }
  }, [error, success]);

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
      setEmail("");
      setPassword("");
      setConfirmCode("");
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const { mutate: register, isPending: isRegisterPending } = useCustomPost({
    onSuccess: () => {
      setIsEmailModalOpen(false);
      setIsOtpModalOpen(true);
      setError("");
      setSuccess("Код отправлен на ваш email");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Ошибка при регистрации");
    },
  });

  const { mutate: confirmEmail, isPending: isConfirmPending } = useCustomPost({
    onSuccess: () => {
      login({
        endpoint: "/auth/login",
        body: { email, password },
        headers: {
          "Accept-Language": i18n.language.split("-")[0],
        },
      });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Ошибка при подтверждении");
    },
  });

  const { mutate: login } = useCustomPost({
    onSuccess: (res: any) => {
      setToken(res.access_token);
      localStorage.setItem("isAuthenticated", "true");
      setTimeout(() => {
        navigate(APP_ROUTES.HOME);
        onClose();
      }, 1500);
      setSuccess("Вход успешен")
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Ошибка при входе");
    },
  });

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); 
    if (email.includes("@") && password.length >= 4) {
      register({
        endpoint: "/auth/register",
        body: { email, password },
        headers: {
          "Accept-Language": i18n.language.split("-")[0],
        },
      });
    } else {
      setError("Введите действительный email и пароль (не менее 4 символов)");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); 
    if (confirmCode.length > 0) {
      confirmEmail({
        endpoint: "/auth/confirm-email",
        body: { email, confirm_code: confirmCode },
        headers: {
          "Accept-Language": i18n.language.split("-")[0],
        },
      });
    } else {
      setError("Введите код подтверждения");
    }
  };

  const handleBackClick = () => {
    setIsEmailModalOpen(true);
    setIsOtpModalOpen(false);
    setConfirmCode("");
    setError("");
    setSuccess("");
  };

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
                  disabled={isRegisterPending}
                />
                <label>{t("modal.password")}</label>
                <input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isRegisterPending}
                />
                {error && <p className="otp-error-text">{error}</p>}
                <button
                  className="modal-accept"
                  type="submit"
                  disabled={!email.includes("@") || password.length < 4 || isRegisterPending}
                >
                  {isRegisterPending ? "Регистрация..." : t("modal.next")}
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
                <label>Код подтверждения</label>
                <input
                  type="text"
                  placeholder="Введите код подтверждения"
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value)}
                  className="otp-input"
                  disabled={isConfirmPending}
                />
                {error && <p className="otp-error-text">{error}</p>}
                <button
                  className="modal-accept"
                  type="submit"
                  disabled={confirmCode.length === 0 || isConfirmPending}
                >
                  {isConfirmPending ? "Подтверждение..." : t("modal.accept")}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalLayout;