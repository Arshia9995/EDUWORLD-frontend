import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";
import "./App.css";
import AdminRoutes from "./routes/AdminRoutes";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { getUserDataFirst, isExist, userLogout } from "./redux/actions/userActions";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor} from './redux/store'

const App: React.FC = () => {
  const { user, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // console.log(user, "user in the app.tsx");
  // const fetchUserData = async () => {
  // .............................................
    useEffect(() => {
      checkExist();
  },[]);

  const checkExist = async () => {
    if (user) {
      try {
        const response = await dispatch(isExist()).unwrap();
        if (response?.data.isBlocked) {
          console.log("checiking is user blockec by admin ......................///")
          await dispatch(userLogout())
          toast.error('Your Account is Blocked. Contact the Admininstrator')
          navigate('/login')
          console.log("blocked by admin ......................///")
        }
      } catch (error) {
        console.error('Error checking user existence:', error);
     
      }
    }
  };

  // .......................................
  // };

  // useEffect(() => {
  //   fetchUserData(); // Call the async function
  // }, [ dispatch, user]);

//   if (loading) {
//     return <div>Loading...</div>; // Or your loading component
// }

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
