import React from 'react';
import {View, Text, Button} from 'react-native';
import {useForecastStore} from '../store/useForecastStore';

export default function ForecastScreen() {
  const value = useForecastStore(state => state.value);
  const setValue = useForecastStore(state => state.setValue);

  return (
    <View>
      <Text>予測画面</Text>
      <Text>値: {value}</Text>
      <Button title="増やす" onPress={() => setValue(value + 1)} />
    </View>
  );
}
