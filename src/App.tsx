import React from "react";
import { Route,Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import { Toaster } from "react-hot-toast";
import './index.css'
import './App.css'

const App: React.FC = () => {
 

  return (
    <>
     <Toaster />
      <Routes>
            <Route path="/*" element={<UserRoutes />} />
        </Routes>
    </>
  )
}

export default App
