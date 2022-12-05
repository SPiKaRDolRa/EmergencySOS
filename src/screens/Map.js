import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

const Map = () => {
  return (
    <SafeAreaView className="bg-[#D9D9D9] flex-1">
      <ScrollView>
        <View className="items-center space-y-4 mt-[50] h-[50vh] justify-center rounded-2xl border w-4/5 self-center bg-slate-300">
          <Text className="text-3xl text-black font-bold">Map</Text>
          <Text className="text-3xl text-black font-bold">Coming soon...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Map
