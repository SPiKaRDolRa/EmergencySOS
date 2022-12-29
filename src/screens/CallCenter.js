import React from 'react'
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { FlatGrid } from 'react-native-super-grid'

const Map = () => {
  const [calls, setCalls] = React.useState([
    { number: 191, name: 'เหตุด่วน เหตุร้าย' },
    { number: 1669, name: 'เจ็บป่วยฉุกเฉิน' },
    { number: 199, name: 'ดับเพลิง' },
    { number: 1197, name: 'ข้อมูลจราจร' },
    { number: 1193, name: 'ตำรวจทางหลวง' },
    { number: 1153, name: 'ตำรวจท่องเที่ยว' },
  ])

  const clickToCall = number => {
    Linking.openURL(`tel:${number}`)
  }

  return (
    <SafeAreaView className="bg-[#D9D9D9] flex-1">
      {/* <ScrollView> */}
      <View className="my-[30]">
        <View className="items-center">
          <Text className="text-3xl text-black font-bold">รวมสายด่วน</Text>
        </View>

        <Text className="mt-[30] text-xs text-center">
          หน้ารวบรวมสายด่วนที่จำเป็นเมื่ออยู่ในเหตุฉุกเฉิน{'\n'}
          ไม่ว่าปัญหาบนท้องถนนจะเป็นอย่างไร ปลอดภัยหายห่วง
        </Text>

        <View className="mt-[40] w-full self-center">
          <FlatGrid
            itemDimension={130}
            data={calls}
            spacing={10}
            maxItemsPerRow={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex h-[100] mb-[10] border border-[#2512B9] bg-white rounded-[10px] items-center"
                onPress={() => clickToCall(item.number)}>
                <Text className="text-[#58AD69] text-3xl mt-5">
                  {item.number}
                </Text>

                <View className="h-[30] rounded-[10px] bg-[#2512B9] w-full items-center justify-center bottom-0 absolute">
                  <Text className="text-white text-base">{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  )
}

export default Map
