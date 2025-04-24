import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TradeDetail() {
    const { symbol } = useLocalSearchParams<{ symbol: string }>();
    const router = useRouter();
    const [coin, setCoin] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'buy' | 'sell'>('buy');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoin = async () => {
            try {
                const res = await fetch(
                    'https://api.coingecko.com/api/v3/coins/' + symbol + '?localization=false&market_data=true',
                    {
                        headers: {
                            'x-cg-demo-api-key': 'CG-H7NdVapum2tGyceKj2rMoDVn',
                        },
                    }
                );

                const data = await res.json();
                setCoin(data);
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Failed to load coin data');
            } finally {
                setLoading(false);
            }
        };

        fetchCoin();
    }, [symbol]);

    const handleSubmit = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
      
        const quantity = parseFloat(amount);
        const price = coin.market_data.current_price.eur;
        const total = quantity * price;
      
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return Alert.alert('Error', 'User not logged in');
        
            const { email } = JSON.parse(userData); 

            const res = await fetch('http://192.168.X.X:3000/api/trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    type,
                    coin: coin.id, 
                    amount: quantity,
                    price,
                }),
            });
        
            const result = await res.json();
        
            if (res.ok) {
                Alert.alert('Trade Executed', `${type.toUpperCase()} ${quantity} ${coin.symbol.toUpperCase()} for €${total.toFixed(2)}\nNew Balance: €${result.balance.toFixed(2)}`);
                setAmount('');
                router.replace('/tabs/profile');
            } else {
                Alert.alert('Trade Failed', result.error);
            }
        } catch (err) {
            console.error('Trade error:', err);
            Alert.alert('Error', 'Could not complete trade');
        }
    };

    if (loading || !coin) {
        return (
            <View className="flex-1 bg-slate-800 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const totalPrice = parseFloat(amount) * coin.market_data.current_price.eur;

    return (
        <View className="flex-1 bg-slate-800 px-6 pt-10 pb-20">
            <View className="items-center mb-4 mt-6">
                <Image source={require('../../assets/images/logo.png')} className="w-36 h-20" resizeMode="contain" />
            </View>

            <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center">
                <Ionicons name="arrow-back" size={22} color="#fff" />
                <Text className="text-white ml-2 text-2xl">Back</Text>
            </TouchableOpacity>

            <Text className="text-white text-3xl font-bold mb-6 text-center">{coin.name}</Text>

            <Text className="text-white text-lg mb-2 text-center">Current Price: €{coin.market_data.current_price.eur.toLocaleString()}</Text>

            <View className="flex-row space-x-4 mb-4 gap-2">
                <TouchableOpacity onPress={() => setType('buy')} className={`px-4 py-2 rounded-xl w-3/6 items-center ${type === 'buy' ? 'bg-green-600' : 'bg-slate-700'}`}>
                    <Ionicons name="arrow-up-circle-outline" size={20} color="#fff" />
                    <Text className="text-white font-semibold text-center mt-1">Buy</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setType('sell')} className={`px-4 py-2 rounded-xl w-3/6 items-center ${type === 'sell' ? 'bg-red-600' : 'bg-slate-700'}`}>
                    <Ionicons name="arrow-down-circle-outline" size={20} color="#fff" />
                    <Text className="text-white font-semibold text-center mt-1">Sell</Text>
                </TouchableOpacity>
            </View>

            <TextInput placeholder="Amount" placeholderTextColor="#ccc" keyboardType="numeric" value={amount} onChangeText={setAmount} className="bg-white rounded-xl px-4 py-2 text-base mb-4 text-gray-900" />

            {amount && !isNaN(Number(amount)) && (
                <View className="bg-white rounded-xl p-4 mb-4">
                    <Text className="text-gray-800 text-lg font-semibold mb-1">Trade Summary:</Text>
                    <Text className="text-gray-600">Type: <Text className="font-bold capitalize">{type}</Text></Text>
                    <Text className="text-gray-600">Price: <Text className="font-bold">€{coin.market_data.current_price.eur.toFixed(2)}</Text></Text>
                    <Text className="text-gray-800 mt-2 font-bold">Total: €{totalPrice.toFixed(2)}</Text>
                </View>
            )}

            <TouchableOpacity onPress={handleSubmit} className={`py-3 rounded-xl items-center ${amount && !isNaN(Number(amount)) ? 'bg-blue-500' : 'bg-blue-300'}`} disabled={!amount || isNaN(Number(amount))}>
                <Text className="text-white font-bold text-lg">Submit Trade</Text>
            </TouchableOpacity>
        </View>
    );
}
