import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import { privateRoutes } from "./routes/private_routes";
import {
  LoginPage,
  RegistroPage,
  InicioPage,
  DashboardPage,
  MisObjetosPage,
  FavoritosPage,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<InicioPage />} />
                <Route path="/dashboard" element={<privateRoutes><DashboardPage /></privateRoutes>} />
                <Route path="/mis-objetos" element={<privateRoutes><MisObjetosPage /></privateRoutes>} />
                <Route path="/favoritos" element={<privateRoutes><FavoritosPage /></privateRoutes>} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;