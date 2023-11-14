import { useEffect } from "react";
import axios from "axios";
import API_URL from "./ApiConfig";
import { useNavigate, useLocation } from "react-router-dom";

const useCheckProfileCompletion = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user.email || '';

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkUserProfileCompletion = async () => {
            if (!userEmail) {
                console.error('user not found')
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/check_profile/${userEmail}`);
                console.log(`profile: ${response.data}`);
                if (response.data['Email']){
                    if (location.pathname === '/details') {
                        navigate('/home');
                    }
                }
                else {
                    navigate('/details');
                }
            } catch (error) {
                console.error(`error checking profile completion: ${error}`);
            }
        };
        
        if (user){
            checkUserProfileCompletion();
        }
    }, [user, userEmail, navigate, location.pathname]);

    return null;
}

export default useCheckProfileCompletion;
