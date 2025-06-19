import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ForecastScreen from './src/screens/ForecastScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ActualsScreen from './src/screens/ActualsScreen';
import InitialRowSection from './src/components/InitialRowSection';
import FieldCustomizeSection from './src/components/FieldCustomizeSection';
import FieldSortSection from './src/components/FieldSortSection';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 設定タブ用のStackNavigator
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="設定" component={SettingsScreen} />
      <Stack.Screen name="入力開始年月" component={InitialRowSection} />
      <Stack.Screen
        name="入力項目の追加削除"
        component={FieldCustomizeSection}
      />
      <Stack.Screen name="入力項目の並び替え" component={FieldSortSection} />
      <Stack.Screen name="入力データのクリア" component={InitialRowSection} />
      <Stack.Screen name="テーマカラーの変更" component={InitialRowSection} />
      <Stack.Screen name="通貨" component={InitialRowSection} />
      <Stack.Screen name="言語" component={InitialRowSection} />
      <Stack.Screen name="サブスクリプション" component={InitialRowSection} />
      <Stack.Screen name="バッジ" component={InitialRowSection} />
      <Stack.Screen name="プライバシーポリシー" component={InitialRowSection} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="実績入力"
          component={ActualsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="table-edit"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="資産予測"
          component={ForecastScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
                name="chart-line"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="設定画面"
          component={SettingsStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
