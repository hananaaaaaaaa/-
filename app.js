import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { LoginForm, RegisterForm } from './auth';
import { Dashboard } from './dashboard';
import './style.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        // 检查本地存储的token
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const handleLogin = (userData) => {
        setCurrentUser(userData.user);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData.user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const switchToRegister = () => setIsLogin(false);
    const switchToLogin = () => setIsLogin(true);

    if (currentUser) {
        return React.createElement(Dashboard, { 
            user: currentUser, 
            onLogout: handleLogout 
        });
    }

    return React.createElement('div', { className: 'auth-container' },
        React.createElement('div', { className: 'auth-card' },
            React.createElement('h1', { className: 'auth-title' }, 
                isLogin ? '登录' : '注册'
            ),
            
            isLogin ? 
                React.createElement(LoginForm, { 
                    onLogin: handleLogin,
                    onSwitch: switchToRegister
                }) :
                React.createElement(RegisterForm, {
                    onRegister: handleLogin,
                    onSwitch: switchToLogin
                })
        )
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
