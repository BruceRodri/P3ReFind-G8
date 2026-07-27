import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import { privateRoutes } from "./routes/private_routes";
import {
  LoginPage,
  RegistroPage,
  InicioPage,
  MisObjetosPage,
  MensajesPage,
  AdminPage,
  PerfilPage,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registro" element={<RegistroPage />} />
                <Route path="/" element={<InicioPage />} />
                <Route path="/mis-objetos" element={<privateRoutes><MisObjetosPage /></privateRoutes>} />
                <Route path="/mensajes" element={<privateRoutes><MensajesPage /></privateRoutes>} />
                <Route path="/admin" element={<privateRoutes><AdminPage /></privateRoutes>} />
                <Route path="/perfil/:id" element={<PerfilPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
