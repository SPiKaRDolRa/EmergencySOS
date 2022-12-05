import React from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

const Map = () => {
  return (
    <SafeAreaView className="bg-[#D9D9D9] flex-1">
      <ScrollView>
        <View className="my-[30]">
          <View className="items-center">
            <Text className="text-3xl text-black font-bold">รวมสายด่วน</Text>
          </View>

          <Text className="mt-[30] text-xs text-center">
            หน้ารวบรวมสายด่วนที่จำเป็นเมื่ออยู่ในเหตุฉุกเฉิน{'\n'}
            ไม่ว่าปัญหาบนท้องถนนจะเป็นอย่างไร ปลอดภัยหายห่วง
          </Text>

          <View className="items-center space-y-4 mt-[50] h-[50vh] justify-center rounded-2xl border w-4/5 self-center bg-slate-300">
            <Text className="text-3xl text-black font-bold">Contacts</Text>
            <Text className="text-3xl text-black font-bold">
              Coming soon...
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Map
