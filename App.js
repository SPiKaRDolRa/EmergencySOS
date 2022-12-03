import React from 'react'
import {Image, Text, View} from 'react-native'

const EmergencyApp = () => {
  return (
    <View className="bg-[#D9D9D9] flex-1 items-center space-y-4">
      <View className="flex-row space-x-4 justify-center mt-2 items-center">
        <Image
          source={require('./src/assets/rmutl-logo.png')}
          className="h-[100] w-[60]"
        />
        <Text className="text-xl font-bold">มหาวิทยาลัยรายมงคลล้านนา</Text>
      </View>

      <Image
        source={require('./src/assets/civil-logo.png')}
        className="h-[285] w-auto rounded-xl"
      />
    </View>
  )
}

export default EmergencyApp
