import React from "react";
import { Route,Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import './index.css'


import './App.css'

const App: React.FC = () => {
 

  return (
    <>
      <Routes>
            <Route path="/*" element={<UserRoutes />} />
        </Routes>
    </>
  )
}

export default App
