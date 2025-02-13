import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Creating the AppContext
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "$";
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Use "" instead of false
    const [userData,setUserData] = useState(false)

    // Sync token changes with localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);
  

    // Fetch doctors with Authorization header
    const getAllDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/list`, {
                headers: { Authorization: `Bearer ${token}` }// Add token to headers
           
            });
            console.log("lnjbk" + data)
            if (data.success) {
                setDoctors(data.doctors);  
            } else {
                toast.error(data.message);
                
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error("Failed to fetch doctor data");
        }
    };

    const loadUserProfileData = async () => {
        try{

            const {data} = await axios.get(backendURL + '/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            }
            else{
                toast.error(data.message);
            }

        } catch(error){
            console.error(error);
            toast.error(error.message);
        }
    }


    // useEffect to trigger fetching when token changes
    useEffect(() => {
        if (token){ getAllDoctorsData();
        loadUserProfileData()
        }else{
            setUserData(false)
        }
    }, [token]); // Fetch doctors when token changes

    return (
        <AppContext.Provider value={{ doctors, currencySymbol, token, setToken, backendURL, userData , setUserData, loadUserProfileData, getAllDoctorsData}}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
