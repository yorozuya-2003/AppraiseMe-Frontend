import { useEffect } from "react";
import axios from "axios";
import API_URL from "./ApiConfig";
import { useNavigate, useLocation } from "react-router-dom";

const useCheckProfileCompletion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let user = JSON.parse(localStorage.getItem("user"));
  let userEmail = null;
  if (user) {
    userEmail = user.email;
  }

  useEffect(() => {
    const checkUserProfileCompletion = async () => {
      if (!userEmail) {
        console.error("user not found");
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/check_profile/${userEmail}`
        );
        console.log(`profile:`, response.data);
        if (response.data["email"]) {
          if (location.pathname === "/details") {
            if (location.pathname !== "/home") {
              navigate("/home");
            }
          }
        } else {
          if (location.pathname !== "/details") {
            navigate("/details");
          }
        }
      } catch (error) {
        console.error(`error checking profile completion:`, error);
      }
    };

    if (user) {
      checkUserProfileCompletion();
    }
  }, [user, userEmail, navigate, location.pathname]);

  return null;
};

export default useCheckProfileCompletion;
