import { createContext, useCallback, useEffect, useState } from "react";
import { apicall_loginuser, apicall_logout, apicall_registerUser, apicall_retrieveCsrfToken, apicall_retrieveSession, retrieveErrorMessage, retrieveMessage } from "../api/ApiCall";

export const AuthContext = createContext();

function AuthProvider({ children }){

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userExternalId, setUserExternalId] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [authLoadError, setAuthLoadError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        apicall_retrieveCsrfToken()
            .then(() => apicall_retrieveSession())
            .then(response => {
                if (!isMounted) return;
                const session = response.data.responseData;
                setIsAuthenticated(true);
                setIsAdmin(session.role === "ADMIN");
                setUserExternalId(session.userExternalId || null);
            })
            .catch(error => {
                if (!isMounted) return;
                if (error.response?.status !== 401) {
                    setAuthLoadError(retrieveErrorMessage(error));
                }
            })
            .finally(() => {
                if (isMounted) setIsAuthLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const onLogout = useCallback(async () => {
        await apicall_logout();
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserExternalId(null);
        setAuthLoadError(null);
    }, []);

    const signUp = async (userRequestDTO) => {
        try {
            const response = await apicall_registerUser(userRequestDTO);

            if(response.data.success) {
                setIsAuthLoading(false);
                setAuthLoadError(null);
                setIsAuthenticated(true);
                setIsAdmin(false);
                setUserExternalId(response?.data?.responseData?.userExternalId);
                return { success: true };
            } else {
                setIsAuthLoading(false);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setUserExternalId(null);
               return { success: false, errorMessage: retrieveMessage(response) };
            }

        } catch (error) {
            setIsAuthLoading(false);
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUserExternalId(null);

            return { success: false, errorMessage: retrieveErrorMessage(error) };
        }
    };

    const login = async (userRequestDTO) => {
        try {
            const response = await apicall_loginuser(userRequestDTO);

            if(response.data.success) {
                const session = response.data.responseData;
                setIsAuthLoading(false);
                setAuthLoadError(null);
                setIsAuthenticated(true);
                setIsAdmin(session.role === "ADMIN");
                setUserExternalId(session.userExternalId || null);
                return { success: true };
            } else {
                setIsAuthLoading(false);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setUserExternalId(null);

                return { success: false, errorMessage: retrieveMessage(response) };
            }
        } catch (error) {
            setIsAuthLoading(false);
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUserExternalId(null);

            return { success: false, errorMessage: retrieveErrorMessage(error) };
        }
    }

    return (
        <AuthContext.Provider value={ {
            isAuthenticated,
            isAdmin,
            isAuthLoading,
            authLoadError,
            login,
            onLogout,
            signUp,
            userExternalId
        } }>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;