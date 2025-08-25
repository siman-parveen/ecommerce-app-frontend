import { createContext, useState } from "react";
import { apicall_loginuser, apicall_registerUser, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";

export const AuthContext = createContext();

function AuthProvider({ children }){

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [userExternalId, setUserExternalId] = useState(null);

    //const [errorMessage, setErrorMessage] = useState("");

    function onLogout() {
        setIsAuthenticated(false);
        setIsAdmin(false);
    }

    const signUp = async (userRequestDTO) => {
        try {
            const response = await apicall_registerUser(userRequestDTO);

            if(response.data.success) {
                setIsAuthenticated(true);
                setIsAdmin(false);
                setUserExternalId(response?.data?.responseData?.userExternalId);
                return { success: true };
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
                setUserExternalId(null);
               return { success: false, errorMessage: retrieveMessage(response) };
            }

        } catch (error) {
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUserExternalId(null);

            return { success: false, errorMessage: retrieveErrorMessage(error) };
        }
    };

    const login = async (userRequestDTO) => {
        if (userRequestDTO.emailId === "admin@gmail.com" && userRequestDTO.password === "Passw0rd-admin") {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setUserExternalId(null);
            return { success: true };
        } else {
            try {
                const response = await apicall_loginuser(userRequestDTO);

                if(response.data.success) {
                    setIsAuthenticated(true);
                    setIsAdmin(false);
                    setUserExternalId(response.data.responseData.userExternalId);
                    return { success: true };
                } else {
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    setUserExternalId(null);

                    return { success: false, errorMessage: retrieveMessage(response) };
                }
                
            } catch (error) {
                setIsAuthenticated(false);
                setIsAdmin(false);
                setUserExternalId(null);

                return { success: false, errorMessage: retrieveErrorMessage(error) };
            }
        }
         
    }

    function isLoggedIn(email, password) {
        if(email === "siman.parveen29@gmail.com" && password === "Passw0rd") {
            setIsAuthenticated(true);
            setIsAdmin(false);
            return true;
        } else if (email === "admin@gmail.com" && password === "Passw0rd-admin") {
            setIsAuthenticated(true);
            setIsAdmin(true);
            return true;
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
            return false;
        }
    }

    return (
        <AuthContext.Provider value={ {isAuthenticated, isAdmin, login, onLogout, signUp, userExternalId} }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;