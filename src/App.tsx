import React from "react";
import { Route,Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import { Toaster } from "react-hot-toast";
import './index.css'
import './App.css'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { getUserDataFirst } from "./redux/actions/userActions";


const App: React.FC = () => {
 const {user} = useSelector((state: RootState) => state.user);
 const dispatch = useDispatch<AppDispatch>();
 console.log(user,"user in the app.tsx")
 
 const getUser = async () => {
  try {
    await dispatch(getUserDataFirst());
  } catch (error) {
    console.log("ERROR in APP getUser Catch:-",error)
  }
 }

 if(!user){
 const reponse = getUser(); 
 }
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
