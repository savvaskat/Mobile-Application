import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Trade = {
    _id: string;
    type: 'buy' | 'sell';
    coin: string; 
    amount: number;
    price: number;
    total: number;
    timestamp: string;
};  

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [balance, setBalance] = useState(0);
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userStr = await AsyncStorage.getItem('user');

                if (!userStr) return;

                const user = JSON.parse(userStr);
                const userEmail = user?.email;

                if (!userEmail) return;

                const res = await fetch('http://192.168.X.X:3000/api/profile/' + userEmail);
                const data = await res.json();

                setFullname(data.fullname || '');
                setEmail(data.email || '');
                setBalance(data.balance ?? 0);
                setTrades(data.trades ?? []);
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 bg-slate-800 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-800 px-6 pt-10 pb-20">
            <View className="items-center mb-4 mt-6">
                <Image source={require('../../assets/images/logo.png')} className="w-36 h-20" resizeMode="contain" />
            </View>

            <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-3">
                    <View className="bg-white w-12 h-12 rounded-full items-center justify-center shadow">
                        <Ionicons name="person-outline" size={24} color="#1e293b" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-semibold">{fullname}</Text>
                        <Text className="text-gray-400 text-sm">{email}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem('user');
                    router.replace('/');
                }}>
                    <Ionicons name="log-out-outline" size={24} color="#f87171" />
                </TouchableOpacity>
            </View>

            <View className="bg-white rounded-2xl p-4 shadow mb-6">
                <Text className="text-gray-800 text-lg font-medium mb-1">Account Balance</Text>
                <Text className="text-green-600 text-2xl font-bold">€{balance.toFixed(2)}</Text>
            </View>

            <Text className="text-white text-2xl font-semibold mb-3">Active Trades</Text>

            {trades.length === 0 ? (
                <View className="bg-slate-700 rounded-xl p-6 items-center">
                    <Ionicons name="document-text-outline" size={40} color="#94a3b8" />
                    <Text className="text-gray-300 mt-2">No trades found</Text>
                </View>
            ) : (
                trades.map((trade) => (
                    <View key={trade._id} className="bg-white rounded-xl p-4 mb-3 shadow">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-gray-800 font-semibold text-lg">
                                {(trade.coin || 'N/A').toUpperCase()}
                            </Text>
                            <View className={`px-3 py-1 rounded-full ${trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`text-xs font-bold ${trade.type === 'buy' ? 'text-green-700' : 'text-red-700'}`}>
                                    {trade.type.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <Text className="text-gray-600 mb-1">
                            {trade.amount} @ €{trade.price.toFixed(2)} = <Text className="font-semibold">€{trade.total.toFixed(2)}</Text>
                        </Text>

                        <Text className="text-gray-400 text-sm">
                            {new Date(trade.timestamp).toLocaleString()}
                        </Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
}