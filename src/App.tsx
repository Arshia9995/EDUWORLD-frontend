import React  from "react";
import { Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import  { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";
import AdminRoutes from "./routes/AdminRoutes";
import { ToastContainer } from "react-toastify";
import {  useSelector } from "react-redux";
import {  RootState } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import {  persistor} from './redux/store'


const App: React.FC = () => {
  const {  error } = useSelector((state: RootState) => state.user);
 

  // console.log(user, "user in the app.tsx");
  // const fetchUserData = async () => {
  // .............................................
  //   useEffect(() => {
  //     checkExist();
  // },[]);



  // .......................................
  // };

  // useEffect(() => {
  //   fetchUserData(); // Call the async function
  // }, [ dispatch, user]);

//   if (loading) {
//     return <div>Loading...</div>; // Or your loading component
// }

// useEffect(() => {
//       dispatch(getallInstructors());
//     }, [dispatch]);

if (error) {
  // Handle error state
  console.error(error);
}

  return (
    <>
    <PersistGate loading={<div>Loading persisted state...</div>} persistor={persistor}>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} /> 
      </Routes>
      <Toaster />
      <ToastContainer />
      </PersistGate>
    </>
  );
};

export default App;
