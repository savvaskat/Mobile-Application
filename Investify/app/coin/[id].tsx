import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CoinDetail() {
    const router = useRouter()
    const { id } = useLocalSearchParams();
    const [coin, setCoin] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoin = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/coins/' + id, {
                    headers: {
                      'x-cg-demo-api-key': 'CG-H7NdVapum2tGyceKj2rMoDVn'
                    }
                });

                const data = await res.json();
                setCoin(data);
            } catch (err) {
                console.error('Failed to load coin data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoin();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 bg-slate-800 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!coin) {
        return (
            <View className="flex-1 bg-slate-800 items-center justify-center">
                <Text className="text-white">Failed to load coin data.</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-slate-800 px-6 pt-10 pb-20">
            <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center top-12">
                <Ionicons name="arrow-back" size={22} color="#fff" />
                <Text className="text-white ml-2 text-2xl">Back</Text>
            </TouchableOpacity>
            <View className="items-center mb-6 mt-10">
                <Image source={{ uri: coin.image.large }} className="w-24 h-24 mb-4" />
                <Text className="text-white text-3xl font-bold">{coin.name}</Text>
                <Text className="text-gray-400 text-lg">({coin.symbol.toUpperCase()})</Text>
            </View>

            <Text className="text-white text-lg font-semibold mb-2">Current Price:</Text>
            <Text className="text-green-400 text-2xl mb-4">€
                {coin.market_data.current_price.eur.toLocaleString()}
            </Text>

            <Text className="text-white text-lg font-semibold mb-2">Market Cap:</Text>
            <Text className="text-gray-300 text-base mb-4">€
                {coin.market_data.market_cap.eur.toLocaleString()}
            </Text>

            <Text className="text-white text-lg font-semibold mb-2">Description:</Text>
            <Text className="text-gray-300 text-base leading-6">
                {coin.description.en?.replace(/<[^>]+>/g, '') || 'No description available.'}
            </Text>
            
            <View className='h-28'>
            </View>
        </ScrollView>
    );
}
