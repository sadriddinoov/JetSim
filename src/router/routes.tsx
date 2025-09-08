import { lazy } from "react";
import { APP_ROUTES } from "./path";

const Home = lazy(() => import("../pages/Home/Home"));

export const appRoutes = [
  { path: APP_ROUTES.HOME, element: <Home /> },
];
