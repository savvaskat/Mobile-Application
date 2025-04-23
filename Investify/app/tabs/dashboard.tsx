import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type Coin = {
    id: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
};

export default function Dashboard() {
    const router = useRouter();
    const [coins, setCoins] = useState<Coin[]>([]);
    const [username, setUsername] = useState('')

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            try {
                const res = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin,ethereum,solana,dogecoin,cardano,tether&order=market_cap_desc&per_page=10&page=1&sparkline=false',
                    {
                        headers: {
                            'x-cg-demo-api-key': 'CG-H7NdVapum2tGyceKj2rMoDVn',
                        },
                    }
                );

                const data = await res.json();
                setCoins(data);
            } catch (err) {
                console.error('Error fetching crypto data:', err);
            }
        };

        fetchCryptoPrices();
    }, []);

    const formatPrice = (num: number) => {
        if (num >= 1000000000) {
            return '€' + (num / 1_000_000_000).toFixed(1) + 'B';
        }
      
        if (num >= 1000000) {
            return '€' + (num / 1_000_000).toFixed(1) + 'M';
        }
      
        if (num >= 1000) {
            return '€' + (num / 1000).toFixed(1) + 'K';
        }
      
        return '€' + num.toFixed(2);
    };

    const loadUser = async () => {
        const user = await AsyncStorage.getItem('user');

        if (user) {
            const parsed = JSON.parse(user);
            setUsername(parsed.fullname);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <ScrollView className="flex-1 bg-slate-800 px-6 pt-12 pb-20">
            <View className="items-center mb-4 mt-6">
                <Image source={ require('../../assets/images/logo.png') } className="w-36 h-20" resizeMode="contain" />
            </View>

            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-2xl font-semibold">Hello, {username || 'Guest'}  <Ionicons name="heart-outline" size={20} color="#ffffff" /></Text>

                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem('user');
                    router.replace('/');
                }}>
                    <Ionicons name="log-out-outline" size={24} color="#f87171" />
                </TouchableOpacity>
            </View>

            <Text className="text-white text-3xl font-bold mb-6">Live Market</Text>

            {coins.map((coin) => (
                <TouchableOpacity key={coin.id} onPress={() => router.push(`/coin/${coin.id}`)} activeOpacity={0.8}>
                    <View className="bg-white rounded-2xl p-4 shadow mb-4 flex-row justify-between items-center">
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Image source={{ uri: coin.image }} className="w-6 h-6 mr-2" />
                                <Text className="text-gray-900 font-semibold text-base">{coin.name}</Text>
                            </View>

                            <Text className="text-xl font-bold text-gray-800">
                                {formatPrice(coin.current_price)}
                            </Text>

                            <View className="flex-row items-center space-x-1 mt-1 gap-2">
                                <Ionicons name={coin.price_change_percentage_24h >= 0 ? 'trending-up' : 'trending-down'} size={16} color={coin.price_change_percentage_24h >= 0 ? '#16a34a' : '#ef4444'} />
                                <Text className={`font-medium ${ coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'}`}>{coin.price_change_percentage_24h.toFixed(2)}%</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}