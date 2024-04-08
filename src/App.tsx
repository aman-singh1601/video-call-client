import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { privateRoutes } from "@/routes/index";
import AuthMiddleware from '@/routes/AuthMiddleware';

function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* {
            publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))
          } */}
          {
            privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                        <AuthMiddleware>
                          {route.element}
                        </AuthMiddleware>
                }
              />
            ))
          }
        </Routes>
      </Router>
    </>
  )
}

export default App
