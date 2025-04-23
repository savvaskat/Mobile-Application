import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            // ADD YOUR IP ADDRESS
            const res = await fetch('http://192.168.X.X:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const text = await res.text();

            try {
                const data = JSON.parse(text);

                if (res.ok) {
                    Alert.alert('Success', 'Login successful');
                    router.replace('../tabs/dashboard'); 
                } else {
                    Alert.alert('Login Failed', data.error || 'Invalid credentials');
                }
            } catch (jsonErr) {
                console.error('Failed to parse JSON:', jsonErr);
                Alert.alert('Error', 'Unexpected server response');
            }
        } catch (err) {
            console.error('Network or fetch error:', err);
            Alert.alert('Error', 'Could not connect to server');
        }
    };

    const handleSignUpRedirect = () => {
        router.push('/signup');
    };

    return (
        <View className="flex-1 bg-slate-800 px-6 items-center justify-center">
            <View className="bg-[#001f3f] w-full rounded-2xl p-6 shadow-lg z-1 bottom-16">
                <View className="items-center mb-4">
                    <Image source={require('../assets/images/logo.png')} className="w-48 h-28 mb-3 z-1" resizeMode="contain" />
                </View>

                <Text className="text-white text-2xl font-bold text-center mb-4">Login</Text>

                <View className="bg-white rounded-xl flex-row items-center px-3 py-2 mb-4">
                    <MaterialCommunityIcons name="email-outline" size={20} color="#666" className="mr-2" />
                    <TextInput placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} className="flex-1" keyboardType="email-address" autoCapitalize="none"/>
                </View>

                <View className="bg-white rounded-xl flex-row items-center px-3 py-2 mb-4">
                    <MaterialCommunityIcons name="lock-outline" size={20} color="#666" className="mr-2" />
                    <TextInput placeholder="Password" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} className="flex-1"/>
                </View>

                <TouchableOpacity className="mb-4" onPress={() => Alert.alert('Forgot Password?', 'Please contact support at support@investify.com')}>
                    <Text className="text-blue-200 text-right text-sm">Forgot Password?</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={handleLogin} className="bg-blue-500 py-3 rounded-xl items-center">
                    <Text className="text-white font-bold text-lg">Login</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-white">Don't have an account? </Text>
                    <TouchableOpacity onPress={handleSignUpRedirect}>
                        <Text className="text-blue-300 font-semibold">Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}