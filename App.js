import React from 'react'
import MainNavigator from './src/navigation/MainNavigator'
import Toast from 'react-native-toast-message'

const EmergencyApp = () => {
  return (
    <>
      <MainNavigator />
      <Toast />
    </>
  )
}

export default EmergencyApp
