import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native'
import storage from '@react-native-firebase/storage'
import { Input, CheckBox } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'

import { launchImageLibrary } from 'react-native-image-picker'
import Geolocation from 'react-native-geolocation-service'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'

const EmergencyReport = () => {
  const [bobImage, setBobImage] = useState(null)

  const [formData, setFormData] = useState({
    victimVechicle: 'รถยนต์',
    hasParties: false,
    partyVechicle: 'รถยนต์',
    accidentInfo: '',
    lnt: null,
    lng: null,
    img: '',
    createAt: null,
  })

  const openImagePicker = async () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    const result = await launchImageLibrary(options)

    if (result.assets.didCancel) {
      console.log('User cancelled image picker')
    } else if (result.assets.errorMessage) {
      console.log('ImagePicker Error: ', result.assets.errorMessage)
    } else {
      const source = { uri: result.assets[0].uri }
      setBobImage(source)
    }
  }

  const uploadImage = async () => {
    const { uri } = bobImage
    const filename = `/emergency_report/${uri.substring(
      uri.lastIndexOf('/') + 1,
    )}`
    const uploadUri = uri

    const task = storage().ref(filename).putFile(uploadUri)
    // set progress state
    task.on('state_changed', snapshot => {
      console.log(
        `${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`,
      )
    })
    try {
      await task
      const url = await storage().ref(filename).getDownloadURL()

      setFormData({ ...formData, img: url })
      console.log('1', url)
    } catch (e) {
      console.error(e)
    }

    setBobImage(null)
  }

  async function openFineLocationRequest() {
    const hasLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          setFormData({
            ...formData,
            lnt: position.coords.latitude,
            lng: position.coords.longitude,
          })
          console.log('2', position.coords.latitude)
          console.log('3', position.coords.longitude)
        },
        error => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      )
    }
  }

  const onSubmit = async () => {
    await uploadImage()
    await openFineLocationRequest()

    setFormData({ ...formData, createAt: dayjs() })
    console.log('4', dayjs())

    console.log(formData)
  }

  return (
    <SafeAreaView className="bg-[#D9D9D9] flex-1">
      <ScrollView>
        <View className="items-center space-y-4 mt-[30]">
          <Text className="text-3xl text-black font-bold">แจ้งอุบัติเหตุ</Text>
        </View>

        <View className="px-6 mt-4 mb-[30]">
          <View className="mb-4">
            <Text className="ml-1 text-base font-bold text-black">
              ยานพาหนะ
            </Text>
            <View className="border mx-3 border-[gray] rounded-2xl">
              <Picker
                placeholder="เลือกยานพาหนะ"
                label="ยานพาหนะ"
                selectedValue={formData.victimVechicle}
                onValueChange={itemValue =>
                  setFormData({ ...formData, victimVechicle: itemValue })
                }>
                <Picker.Item label="รถยนต์" value="รถยนต์" />
                <Picker.Item label="จักรยานยนต์" value="จักรยานยนต์" />
                <Picker.Item
                  label="จักรยาน, สกูตเตอร์"
                  value="จักรยาน, สกูตเตอร์"
                />
                <Picker.Item label="รถบรรทุก" value="รถบรรทุก" />
              </Picker>
            </View>
          </View>

          <View className="mb-4">
            <Text className="ml-1 text-base font-bold text-black">
              มีคู่กรณีไหม
            </Text>
            <View className="flex-row">
              <CheckBox
                title="มี"
                checked={formData.hasParties}
                onPress={() => setFormData({ ...formData, hasParties: true })}
                containerStyle={styles.checkboxStyle}
              />

              <CheckBox
                title="ไม่มี"
                checked={!formData.hasParties}
                onPress={() => setFormData({ ...formData, hasParties: false })}
                containerStyle={styles.checkboxStyle}
              />
            </View>
          </View>

          {formData.hasParties ? (
            <View className="mb-4">
              <Text className="ml-1 text-base font-bold text-black">
                ยานพาหนะคู่กรณี
              </Text>
              <View className="border mx-3 border-[gray] rounded-2xl">
                <Picker
                  placeholder="เลือกยานพาหนะ"
                  label="ยานพาหนะ"
                  selectedValue={formData.partyVechicle}
                  onValueChange={itemValue =>
                    setFormData({ ...formData, partyVechicle: itemValue })
                  }>
                  <Picker.Item label="รถยนต์" value="รถยนต์" />
                  <Picker.Item label="จักรยานยนต์" value="จักรยานยนต์" />
                  <Picker.Item
                    label="จักรยาน, สกูตเตอร์"
                    value="จักรยาน, สกูตเตอร์"
                  />
                  <Picker.Item label="รถบรรทุก" value="รถบรรทุก" />
                </Picker>
              </View>
            </View>
          ) : null}

          <Input
            placeholder="กรอกรายละเอียดเหตุการณ์"
            label="ลักษณะการเกิดเหตุ"
            value={formData.accidentInfo}
            onChange={e => {
              setFormData({ ...formData, accidentInfo: e.nativeEvent.text })
            }}
            labelStyle={styles.inputLabelStyle}
            inputStyle={styles.inputStyle}
          />

          <TouchableOpacity
            className="bg-[#ECECEC] h-[125] items-center justify-center space-y-2"
            style={styles.uploadTechable}
            onPress={openImagePicker}>
            <MaterialCommunityIcons
              name="image-plus"
              color={'#2512B9'}
              size={30}
            />
            <Text className="text-[#2512B9] font-bold text-center">
              + เพิ่มรูปภาพ{'\n'}สถานที่เกิดเหตุ
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 text-xs">
            เมื่อกดส่งข้อมูลแจ้งเหตุ แอพพลิเคชันจะเก็บข้อมูล ช่วงเวลา และ
            สถานที่เป็นพิกัด
            ของท่านเพื่อติดตามเหตุและบันทึกข้อมูลไว้สำหรับการวิเคราะห์ข้อมูลต่อไป
          </Text>

          <TouchableOpacity
            className="bg-[#E07F77] h-[40] w-[150] mt-8 self-center rounded-2xl items-center justify-center space-y-2"
            onPress={onSubmit}>
            <Text className="text-white font-bold text-xl">แจ้งเหตุ</Text>
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
