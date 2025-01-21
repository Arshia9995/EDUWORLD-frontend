import React from "react";
import OtpVerification from "../../components/auth/OtpVerification";
import { useLocation } from "react-router-dom";

const OtpPage: React.FC = () => {
    const location = useLocation();
    const userData = location.state?.userData;
    console.log("userData:" , userData)
    if (!userData) {
        return <div>Error: User data not found!</div>;
      }
    return (
        <div>
         <OtpVerification userData={userData}/>
        </div>
    );
};

export default OtpPage;