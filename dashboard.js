import React from 'react';
import { Layout, Menu, Card, Button, Avatar, Dropdown } from 'antd';
import { 
    BarChartOutlined, 
    PieChartOutlined, 
    LineChartOutlined,
    GlobalOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { RatingChart } from './charts';

const { Header, Sider, Content } = Layout;

export const Dashboard = ({ user, onLogout }) => {
    const [currentChart, setCurrentChart] = React.useState('rating');

    const userMenuItems = [
        {
            key: 'logout',
            icon: React.createElement(LogoutOutlined),
            label: '退出登录',
            onClick: onLogout
        }
    ];

    const menuItems = [
        { key: 'rating', icon: React.createElement(BarChartOutlined), label: '评分分布' },
        { key: 'year', icon: React.createElement(LineChartOutlined), label: '年份分布' },
        { key: 'country', icon: React.createElement(GlobalOutlined), label: '国家分布' },
        { key: 'genre', icon: React.createElement(PieChartOutlined), label: '类型分布' }
    ];

    const renderChart = () => {
        switch (currentChart) {
            case 'rating':
                return React.createElement(RatingChart);
            default:
                return React.createElement('div', null, '请选择图表类型');
        }
    };

    return React.createElement(Layout, { style: { minHeight: '100vh' } },
        React.createElement(Header, { 
            style: { 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: '#001529',
                color: 'white'
            } 
        },
            React.createElement('div', { style: { fontSize: '20px' } }, '🎬 电影数据平台'),
            
            React.createElement(Dropdown, {
                menu: { items: userMenuItems },
                placement: 'bottomRight'
            },
                React.createElement(Button, {
                    type: 'text',
                    style: { color: 'white' },
                    icon: React.createElement(UserOutlined)
                }, user.username)
            )
        ),
        
        React.createElement(Layout, null,
            React.createElement(Sider, { 
                width: 200,
                style: { background: '#fff' }
            },
                React.createElement(Menu, {
                    mode: 'inline',
                    selectedKeys: [currentChart],
                    items: menuItems,
                    onClick: ({ key }) => setCurrentChart(key),
                    style: { height: '100%', borderRight: 0 }
                })
            ),
            
            React.createElement(Content, { style: { padding: '24px', background: '#f0f2f5' } },
                React.createElement(Card, {
                    title: menuItems.find(item => item.key === currentChart)?.label,
                    style: { minHeight: '400px' }
                }, renderChart())
            )
        )
    );
};
