import { lazy } from "react";
import { APP_ROUTES } from "./path";

const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/AboutUs/About"));
const Confidential = lazy(() => import("../pages/Confidential/Confidential"));
const Oferta = lazy(() => import("../pages/Oferta/Oferta"));
const Rules = lazy(() => import("../pages/Rules/Rules"));
const Usloviya = lazy(() => import("../pages/Usloviya/Usloviya"));
const FAQ = lazy(() => import("../pages/FAQ/FAQ"));
const How = lazy(() => import("../pages/HowWorks/How"));

export const appRoutes = [
  { path: APP_ROUTES.HOME, element: <Home /> },
  { path: APP_ROUTES.ABOUT, element: <About /> },
  { path: APP_ROUTES.CONFIDENTIAL, element: <Confidential /> },
  { path: APP_ROUTES.OFERTA, element: <Oferta /> },
  { path: APP_ROUTES.RULE, element: <Rules /> },
  { path: APP_ROUTES.USLOVIYA, element: <Usloviya /> },
  { path: APP_ROUTES.FAQ, element: <FAQ /> },
  { path: APP_ROUTES.HOW_WORKS, element: <How /> },
];
