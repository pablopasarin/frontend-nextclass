import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginMenu from "./LoginMenu";
import RegisterForm from "./RegisterForm";
import Dashboard from "./Dashboard";
import PasswordRecovery from "./PasswordRecovery"; // Importamos el componente de recuperación de contraseña
import ForgotPassword from "./ForgotPassword";
import EmailConfirmation from "./EmailConfirmation"; // Importamos el componente de confirmación de correo
import { ProtectedRoute } from "./ProtectedRoute";
import MainMenu from "./MainMenu";
import ClassMenu from "./ClassMenu";
import StudentTable from "./ProductTable";
import ClassBook from "./ClassBook";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginMenu />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} /> {/* Nueva ruta */}
        <Route path="/" element={<MainMenu />} />
        <Route path="/class/:classId" element={<ClassMenu />} />
        <Route path="/student-table" element={<StudentTable />} />
        <Route path="/class/:classId/class-book" element={<ClassBook />} />
      </Routes>
    </Router>
  );
}

export default App;