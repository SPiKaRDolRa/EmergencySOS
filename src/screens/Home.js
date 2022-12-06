import React from 'react'
import {
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native'

const Home = ({ navigation }) => {
  const moveEmergencyReport = () => navigation.navigate('EmergencyReport')
  const moveTrafficProblemReport = () =>
    navigation.navigate('TrafficProblemReport')
  const moveMap = () => navigation.navigate('CallCenter')

  return (
    <SafeAreaView className="flex-1 bg-[#D9D9D9]">
      <ScrollView>
        <View className="items-center space-y-4">
          <View className="flex-row space-x-4 justify-center mt-2 items-center">
            <Image
              source={require('../assets/rmutl-logo.png')}
              className="h-[100] w-[60]"
            />
            <Text className="text-xl font-bold">มหาวิทยาลัยราชมงคลล้านนา</Text>
          </View>

          <View className="space-y-6 items-center flex w-4/5">
            <View className="space-y-2">
              <Image
                source={require('../assets/civil-logo.png')}
                className="h-[285] rounded-2xl"
              />

              <Text className="font-bold text-black text-center">
                ช่องทางบริการแจ้งเหตุและปัญหาบนท้องถนน{'\n'}
                ในจังหวัดเชียงใหม่
              </Text>
            </View>

            <View className="w-full">
              <TouchableOpacity
                onPress={moveEmergencyReport}
                className="bg-[#E07F77] h-[80] items-center justify-center rounded-2xl">
                <Text className="text-white text-2xl font-bold">
                  แจ้งอุบัติเหตุ
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row w-full space-x-[5%]">
              <TouchableOpacity
                onPress={moveTrafficProblemReport}
                className="bg-[#F4C675] h-[80] items-center justify-center rounded-2xl w-[47.5%]">
                <Text className="text-xl text-black font-bold text-center">
                  แจ้ง{'\n'}ปัญหา
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={moveMap}
                className="bg-[#80BB8B] h-[80] items-center justify-center rounded-2xl w-[47.5%]">
                <Text className="text-xl text-black font-bold text-center">
                  รวม{'\n'}สายด่วน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
