import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View className='flex-1 bg-green-500 items-center justify-center'>
      <Image source={require('../../../assets/splash.png')} className='w-2/3 h-1/6 animate-pulse'/>
    </View>
  );
};

export default SplashScreen;
