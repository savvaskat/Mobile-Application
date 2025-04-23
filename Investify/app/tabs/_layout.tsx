import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import '../globals.css';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    backgroundColor: '#1e293b',
                    height: 60,
                    borderTopColor: '#0f172a',
                },
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName = '';
                    if (route.name === 'profile') {
                        iconName = 'person';
                    } else if (route.name === 'trade') {
                        iconName = 'swap-horizontal';
                    } else if (route.name === 'dashboard') {
                        iconName = 'home';
                    }

                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
            })}
        />
    );
}
