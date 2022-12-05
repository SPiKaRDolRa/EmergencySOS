import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import HomeScreen from '../screens/Home'
import EmergencyReportScreen from '../screens/EmergencyReport'
import TrafficProblemReportScreen from '../screens/TrafficProblemReport'
import CallCenterScreen from '../screens/CallCenter'
import MapScreen from '../screens/Map'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const HomeStack = createNativeStackNavigator()

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="EmergencyReport"
        options={{ title: 'กลับสู้หน้าหลัก' }}
        component={EmergencyReportScreen}
      />
      <HomeStack.Screen
        name="TrafficProblemReport"
        options={{
          title: 'กลับสู้หน้าหลัก',
        }}
        component={TrafficProblemReportScreen}
      />
      <HomeStack.Screen
        name="CallCenter"
        options={{ title: 'กลับสู้หน้าหลัก' }}
        component={CallCenterScreen}
      />
    </HomeStack.Navigator>
  )
}

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
              <MaterialCommunityIcons
                name="account-circle"
                color={color}
                size={size}
              />
            ),
          }}
          component={HomeStackScreen}
        />

        <Tab.Screen
          name="Map"
          options={{
            title: 'ข้อมูลแผนที่',
            headerTitleAlign: 'center',
            tabBarLabel: 'แผนที่',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="home-city"
                color={color}
                size={size}
              />
            ),
          }}
          component={MapScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
