import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appRoutes } from "./router/routes";
import { AutoScrollToTop } from "./components/scrollToTop";
import { CartProvider } from "./context/CartContext"; 

function App() {
  return (
    <BrowserRouter>
      <AutoScrollToTop />
      <CartProvider>
        <Routes>
          {appRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;