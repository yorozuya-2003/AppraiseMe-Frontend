import { useEffect } from "react";
import axios from "axios";
import API_URL from "./ApiConfig";
import { useNavigate } from "react-router-dom";

const useCheckUserProfileCompletion = () => {
    let user = JSON.parse(localStorage.getItem("user"));
    let userEmail = null;

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            userEmail = user.email;
        }
        navigate('/home')

        if (user) {
        const checkUserProfileCompletion = async () => {
            try {
                const response = await axios.get(`${API_URL}/check_profile/${userEmail}`);
                console.log('Profile Completion:', response.data);
                if (!response.data['Email']){
                    navigate('/details');
                }
            } catch (error) {
                console.error('Error Checking Profile Completion:', error);
            }
        }

        checkUserProfileCompletion();
    }
    }, []);

    return null;
}

export default useCheckUserProfileCompletion;
