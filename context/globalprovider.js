import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser();
                if (response) {
                    setIsLoggedIn(true);
                    setUser(response);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                // Handle error gracefully, e.g., set error state or notify user
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentUser();
    },[])
    return (
        <GlobalContext.Provider
        value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading,
        }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;