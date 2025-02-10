import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";
import AdminRoutes from "./routes/AdminRoutes";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "./redux/store";
// import { getUserDataFirst } from "./redux/actions/userActions";

const App: React.FC = () => {
  // const { user } = useSelector((state: RootState) => state.user);
  // const dispatch = useDispatch<AppDispatch>();

  // console.log(user, "user in the app.tsx");
  // const fetchUserData = async () => {
  //   if (!user) {
  //     await dispatch(getUserDataFirst());
  //   }
  // };

  // useEffect(() => {
  //   fetchUserData(); // Call the async function
  // }, [user, dispatch]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} /> 
      </Routes>
    </>
  );
};

export default App;
