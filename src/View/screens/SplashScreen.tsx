import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View className='flex-1 bg-green-500 items-center justify-center'>
      <Image source={require('../../../assets/LogoOficial.png')} className='w-[50%] h-[10%] animate-pulse'/>
    </View>
  );
};

export default SplashScreen;
