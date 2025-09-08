import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appRoutes } from "./router/routes";
import { AutoScrollToTop } from "./components/scrollToTop";


function App() {
  return (
    <BrowserRouter>
      <AutoScrollToTop />
        <Routes>
          {appRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
