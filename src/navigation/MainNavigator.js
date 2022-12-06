import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import HomeNavigator from './HomeNavigator'
import MapScreen from '../screens/Map'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="HomeStack">
        <Tab.Screen
          name="HomeStack"
          options={{
            headerShown: false,
            tabBarLabel: 'หน้าหลัก',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
          component={HomeNavigator}
        />

        <Tab.Screen
          name="Map"
          options={{
            title: 'ข้อมูลแผนที่',
            headerTitleAlign: 'center',
            tabBarLabel: 'แผนที่',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="earth" color={color} size={size} />
            ),
          }}
          component={MapScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
