import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Input } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const EmergencyReport = () => {
  const [selectedLanguage, setSelectedLanguage] = useState()

  return (
    <SafeAreaView className="bg-[#D9D9D9] flex-1">
      <ScrollView>
        <View className="items-center space-y-4 mt-[30]">
          <Text className="text-3xl text-black font-bold">แจ้งปัญหา</Text>
        </View>

        <View className="px-6 mt-4 mb-[30]">
          <View className="mb-4">
            <Text className="ml-1 text-base font-bold text-black">
              ลักษณะของปัญหา
            </Text>

            <View className="border mx-3 border-[gray] rounded-2xl">
              <Picker
                placeholder="เลือกยานพาหนะ"
                label="ยานพาหนะ"
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedLanguage(itemValue)
                }>
                <Picker.Item label="ไฟส่องสว่าง" value="ไฟส่องสว่าง" />
                <Picker.Item label="เส้นจราจร" value="เส้นจราจร" />
                <Picker.Item label="ป้ายจราจร" value="ป้ายจราจร" />
                <Picker.Item label="สภาพพื้นผิวถนน" value="สภาพพื้นผิวถนน" />
                <Picker.Item label="อื่นๆ" value="อื่นๆ" />
              </Picker>
            </View>
          </View>

          <Input
            placeholder="กรอกรายละเอียด"
            label="ข้อมูลอื่นๆ"
            labelStyle={styles.inputLabelStyle}
            inputStyle={styles.inputStyle}
          />

          <TouchableOpacity
            className="bg-[#ECECEC] h-[125] items-center justify-center space-y-2"
            style={styles.uploadTechable}>
            <MaterialCommunityIcons
              name="image-plus"
              color={'#2512B9'}
              size={30}
            />
            <Text className="text-[#2512B9] font-bold text-center">
              + เพิ่มรูปภาพ{'\n'}ปัญหาบนท้องถนน
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 text-xs">
            เมื่อกดส่งข้อมูลปัญหา แอพพลิเคชันจะเก็บข้อมูล ช่วงเวลา และ
            สถานที่เป็นพิกัด
            ของท่านเพื่อติดตามเหตุและบันทึกข้อมูลไว้สำหรับการวิเคราะห์ข้อมูลต่อไป
          </Text>

          <TouchableOpacity className="bg-[#FFBC49] h-[40] w-[150] mt-8 self-center rounded-2xl items-center justify-center space-y-2">
            <Text className="text-white font-bold text-xl">แจ้งปัญหา</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  uploadTechable: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FF8901',
    borderRadius: 16,
  },

  inputStyle: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'gray',
  },
  inputLabelStyle: {
    marginLeft: -8,
    color: 'black',
  },

  checkboxStyle: {
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 16,
  },
})

export default EmergencyReport
