import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from '../screens/Home'
import EmergencyReportScreen from '../screens/EmergencyReport'
import TrafficProblemReportScreen from '../screens/TrafficProblemReport'
import CallCenterScreen from '../screens/CallCenter'

const HomeStack = createNativeStackNavigator()

const HomeStackScreen = () => {
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
        options={{ title: 'กลับสู่หน้าหลัก' }}
        component={EmergencyReportScreen}
      />
      <HomeStack.Screen
        name="TrafficProblemReport"
        options={{
          title: 'กลับสู่หน้าหลัก',
        }}
        component={TrafficProblemReportScreen}
      />
      <HomeStack.Screen
        name="CallCenter"
        options={{ title: 'กลับสู่หน้าหลัก' }}
        component={CallCenterScreen}
      />
    </HomeStack.Navigator>
  )
}

export default HomeStackScreen
