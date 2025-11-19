import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ children, role }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }
        
        try {
            // Set token in header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const response = await axios.get('/api/user');

            if (response.data.user && response.data.user.role === 'admin') {
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
                setIsAuthenticated(false);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
