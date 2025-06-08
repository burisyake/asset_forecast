import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ForecastScreen from './src/screens/ForecastScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ActualsScreen from './src/screens/ActualsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="実績入力" component={ActualsScreen} />
        <Tab.Screen name="資産予測" component={ForecastScreen} />
        <Tab.Screen name="設定" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
