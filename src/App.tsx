import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoadingSpinner from "./components/UI/atoms/LoadingSpinner";
import AppErrorBoundary from "./components/routes/AppErrorBoundary";
import AdminRoute from "./components/routes/AdminRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { adminRoutes, protectedRoutes, publicRoutes } from "./routes/appRoutes";

function App() {
  return (
    <AppErrorBoundary>
      <Router>
        <Suspense
          fallback={
            <div className="min-h-screen bg-light py-16">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            {publicRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

            {protectedRoutes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <Component />
                  </ProtectedRoute>
                }
              />
            ))}

            {adminRoutes.map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <AdminRoute>
                    <Component />
                  </AdminRoute>
                }
              />
            ))}
          </Routes>
        </Suspense>
      </Router>
    </AppErrorBoundary>
  );
}

export default App;
