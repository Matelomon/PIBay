import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PiNetworkSDK } from 'pi-network-sdk'; // Pi Wallet SDK

const backendUrl = "https://pibay.vercel.app"; // Dein Backend

export default function PiBayApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogin = async () => {
    const piUser = await PiNetworkSDK.login();
    setUser(piUser);
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 10, backgroundColor: '#fff', marginBottom: 10, borderRadius: 5 }}>
      <Image source={{ uri: item.image }} style={{ width: 100, height: 100, borderRadius: 5 }} />
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ fontSize: 16, color: '#ff9900' }}>{item.price} Pi</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#f4f4f4' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>PiBay - Marktplatz</Text>
      {!user ? (
        <Button title='Mit Pi Wallet einloggen' onPress={handleLogin} />
      ) : (
        <Text>Willkommen, {user.username}</Text>
      )}
      <TextInput
        placeholder='Suche nach Produkten...'
        style={{ padding: 10, backgroundColor: '#fff', borderRadius: 5, marginBottom: 10 }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
