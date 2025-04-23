import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen() {
    const router = useRouter();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async() => {
        if (!fullname || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password != confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // ADD YOUR IP ADDRESS
            const response = await fetch('http://192.168.X.X:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Signup successful!');
                await AsyncStorage.setItem('user', JSON.stringify({ fullname, email }));
                router.replace('/');
            } else {
                alert(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred. Try again.');
        }
    };

    const handleLoginRedirect = () => {
        router.replace('/');
    };

    return (
        <View className="flex-1 bg-slate-800 px-6 items-center justify-center">
            <View className="bg-[#001f3f] w-full rounded-2xl p-6 shadow-lg z-1 bottom-16">
                <View className="items-center mb-4">
                    <Image source={require('../assets/images/logo.png')} className="w-48 h-28 mb-3 z-1" resizeMode="contain" />
                </View>

                <Text className="text-white text-2xl font-bold text-center mb-4">Sign Up</Text>

                <View className="bg-white rounded-xl flex-row items-center px-3 py-2 mb-4">
                    <MaterialCommunityIcons name="account-outline" size={20} color="#666" className="mr-2" />
                    <TextInput placeholder="Full Name" placeholderTextColor="#666" value={fullname} onChangeText={setFullname} className="flex-1" />
                </View>

                <View className="bg-white rounded-xl flex-row items-center px-3 py-2 mb-4">
                    <MaterialCommunityIcons name="email-outline" size={20} color="#666" className="mr-2" />
                    <TextInput placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} className="flex-1" keyboardType="email-address" autoCapitalize="none" />
                </View>

                <View className="bg-white rounded-xl flex-row items-center px-3 py-2 mb-4">
                    <MaterialCommunityIcons name="lock-outline" size={20} color="#666" className="mr-2" />
                    <TextInput placeholder="Password" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} className="flex-1" />
                </View>

                <View className="bg-white rounded-xl flex-row items-center px-3 py-2 mb-4">
                    <MaterialCommunityIcons name="lock-check-outline" size={20} color="#666" className="mr-2" />
                    <TextInput placeholder="Confirm Password" placeholderTextColor="#666" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} className="flex-1" />
                </View>

                <TouchableOpacity onPress={handleSignup} className="bg-blue-500 py-3 rounded-xl items-center mt-4">
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-white">Already have an account? </Text>
                    <TouchableOpacity onPress={handleLoginRedirect}>
                        <Text className="text-blue-300 font-semibold">Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
