import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import axios from 'axios';
import healthData from '../../Controller/healthData.json';

export function HealthCenterScreen({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Carregue os dados quando o componente for montado
    setData(healthData);
  }, []);

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.ESTABELECI}</Text>
      <Text>{item.ENDERECO}</Text>
      {/* Adicione outros campos conforme necessário */}
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <View style={{ marginTop: 10, marginLeft: 4, marginRight: 'auto' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={20} color="#1F9A55" />
        </TouchableOpacity>
      </View>
      <Text style={{ color: '#1F9A55', fontSize: 18, marginBottom: 4 }}>Posto de Saúde</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.ID.toString()}
      />
    </View>
  );
}
