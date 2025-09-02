import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

export const LoginForm = ({ onLogin, onSwitch }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            
            const data = await response.json();
            
            if (data.error) {
                message.error(data.error);
            } else {
                message.success('登录成功');
                onLogin(data);
            }
        } catch (error) {
            message.error('登录失败');
        }
        setLoading(false);
    };

    return React.createElement(Form, {
        name: 'login',
        onFinish: handleSubmit,
        autoComplete: 'off',
        size: 'large'
    },
        React.createElement(Form.Item, {
            name: 'username',
            rules: [{ required: true, message: '请输入用户名!' }]
        },
            React.createElement(Input, {
                prefix: React.createElement(UserOutlined),
                placeholder: '用户名'
            })
        ),

        React.createElement(Form.Item, {
            name: 'password',
            rules: [{ required: true, message: '请输入密码!' }]
        },
            React.createElement(Input.Password, {
                prefix: React.createElement(LockOutlined),
                placeholder: '密码'
            })
        ),

        React.createElement(Form.Item, null,
            React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading,
                style: { width: '100%' }
            }, '登录'),
            
            React.createElement('div', { style: { marginTop: '16px', textAlign: 'center' } },
                '没有账号？',
                React.createElement(Button, {
                    type: 'link',
                    onClick: onSwitch,
                    style: { padding: '0 4px' }
                }, '立即注册')
            )
        )
    );
};

export const RegisterForm = ({ onRegister, onSwitch }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            
            const data = await response.json();
            
            if (data.error) {
                message.error(data.error);
            } else {
                message.success('注册成功，请登录');
                onSwitch();
            }
        } catch (error) {
            message.error('注册失败');
        }
        setLoading(false);
    };

    return React.createElement(Form, {
        name: 'register',
        onFinish: handleSubmit,
        autoComplete: 'off',
        size: 'large'
    },
        React.createElement(Form.Item, {
            name: 'username',
            rules: [{ required: true, message: '请输入用户名!' }]
        },
            React.createElement(Input, {
                prefix: React.createElement(UserOutlined),
                placeholder: '用户名'
            })
        ),

        React.createElement(Form.Item, {
            name: 'email',
            rules: [{ type: 'email', message: '请输入有效的邮箱!' }]
        },
            React.createElement(Input, {
                prefix: React.createElement(MailOutlined),
                placeholder: '邮箱（可选）'
            })
        ),

        React.createElement(Form.Item, {
            name: 'password',
            rules: [{ required: true, message: '请输入密码!' }]
        },
            React.createElement(Input.Password, {
                prefix: React.createElement(LockOutlined),
                placeholder: '密码'
            })
        ),

        React.createElement(Form.Item, {
            name: 'confirm',
            dependencies: ['password'],
            rules: [
                { required: true, message: '请确认密码!' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不匹配!'));
                    },
                }),
            ]
        },
            React.createElement(Input.Password, {
                prefix: React.createElement(LockOutlined),
                placeholder: '确认密码'
            })
        ),

        React.createElement(Form.Item, null,
            React.createElement(Button, {
                type: 'primary',
                htmlType: 'submit',
                loading: loading,
                style: { width: '100%' }
            }, '注册'),
            
            React.createElement('div', { style: { marginTop: '16px', textAlign: 'center' } },
                '已有账号？',
                React.createElement(Button, {
                    type: 'link',
                    onClick: onSwitch,
                    style: { padding: '0 4px' }
                }, '立即登录')
            )
        )
    );
};
