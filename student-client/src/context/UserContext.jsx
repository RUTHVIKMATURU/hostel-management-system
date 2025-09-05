import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const API = import.meta.env.VITE_API_URL;

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('studentInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('studentInfo', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentInfo');
    };

    const updateProfile = async (updatedData) => {
        try {
            if (!user || !user.rollNumber) {
                throw new Error('User not authenticated');
            }

            const token = localStorage.getItem('studentToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Create a new endpoint for student profile update
            const response = await axios.put(
                `${API}/student-api/update-profile/${user.rollNumber}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update local state and storage with the updated user data
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            localStorage.setItem('studentInfo', JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
