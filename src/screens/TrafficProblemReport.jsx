import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native'
import storage from '@react-native-firebase/storage'
import { Input } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'

import { launchImageLibrary } from 'react-native-image-picker'
import Geolocation from 'react-native-geolocation-service'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'

import Toast from 'react-native-toast-message'

const EmergencyReport = ({ navigation }) => {
  const [bobImage, setBobImage] = useState(null)

  const [readyFetch, setReadyFetch] = useState(false)

  const [formData, setFormData] = useState({
    problemCategory: 'ไฟส่องสว่าง',
    otherInfo: '',
    lnt: '',
    lng: '',
    img: '',
    createAt: '',
  })

  async function openImagePicker() {
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

  async function uploadImage() {
    const { uri } = bobImage
    const filename = `/emergency_report/${uri.substring(
      uri.lastIndexOf('/') + 1,
    )}`
    const uploadUri = uri
    const ref = storage().ref(filename)
    const task = ref.putFile(uploadUri)

    // set progress state
    task.on('state_changed', snapshot => {
      console.log(
        `firebase uploading ${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`,
      )
    })

    await task.then(async result => {
      const url = await ref.getDownloadURL()

      setFormData(prev => ({ ...prev, img: url }))
    })
  }

  async function openFineLocationRequest() {
    const hasPermissionLacation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
    if (hasPermissionLacation === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        position => {
          setFormData(prev => ({
            ...prev,
            lnt: position.coords.latitude,
            lng: position.coords.longitude,
          }))
        },
        error => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 15000 },
      )
    }
  }

  async function setTimeStamp() {
    const currentTime = dayjs().format()
    setFormData(prev => ({ ...prev, createAt: currentTime }))

    if (formData.problemCategory !== 'อื่นๆ')
      setFormData(prev => ({ ...prev, otherInfo: null }))
  }

  async function fetchReportTrafficProblem() {
    return await fetch('http://35.213.137.95/create-traffic-problem-report', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
  }

  async function onSubmit() {
    await uploadImage()
    await openFineLocationRequest()
    await setTimeStamp()

    setReadyFetch(true)
  }

  async function startFetch() {
    Promise.all([uploadImage, openFineLocationRequest, setTimeStamp]).then(
      async () => {
        await fetchReportTrafficProblem()

        Toast.show({
          type: 'success',
          text1: 'แจ้งปัญหาสำเร็จ',
          text2:
            'ท่านได้แจ้งปัญหาบนท้องถนนเรียบร้อยแล้ว ขอบคุณสำหรับความร่วมมือ 👋',
        })
        navigation.goBack()
      },
    )
  }

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
                selectedValue={formData.problemCategory}
                onValueChange={itemValue =>
                  setFormData({ ...formData, problemCategory: itemValue })
                }>
                <Picker.Item label="ไฟส่องสว่าง" value="ไฟส่องสว่าง" />
                <Picker.Item label="เส้นจราจร" value="เส้นจราจร" />
                <Picker.Item label="ป้ายจราจร" value="ป้ายจราจร" />
                <Picker.Item label="สภาพพื้นผิวถนน" value="สภาพพื้นผิวถนน" />
                <Picker.Item label="อื่นๆ" value="อื่นๆ" />
              </Picker>
            </View>
          </View>

          {formData.problemCategory === 'อื่นๆ' ? (
            <Input
              placeholder="กรอกรายละเอียด"
              label="ข้อมูลอื่นๆ"
              value={formData.otherInfo}
              onChange={e => {
                setFormData({ ...formData, otherInfo: e.nativeEvent.text })
              }}
              labelStyle={styles.inputLabelStyle}
              inputStyle={styles.inputStyle}
            />
          ) : null}

          {bobImage === null ? (
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
                + เพิ่มรูปภาพ{'\n'}ปัญหาบนท้องถนน
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="h-[125] w-auto items-center justify-center rounded-xl"
              onPress={openImagePicker}>
              <Image source={bobImage} className="h-full w-full" />
            </TouchableOpacity>
          )}

          <Text className="mt-4 text-xs">
            เมื่อกดส่งข้อมูลปัญหา แอพพลิเคชันจะเก็บข้อมูล ช่วงเวลา และ
            สถานที่เป็นพิกัด
            ของท่านเพื่อติดตามเหตุและบันทึกข้อมูลไว้สำหรับการวิเคราะห์ข้อมูลต่อไป
          </Text>

          <View className="flex flex-row space-x-4 justify-center">
            <TouchableOpacity
              disabled={bobImage === null}
              className={`${
                bobImage === null ? 'bg-[#D9E9F2]' : 'bg-[#1991D2]'
              }  h-[40] w-[150] mt-8 self-center rounded-2xl items-center justify-center space-y-2`}
              onPress={onSubmit}>
              <Text className="text-white font-bold text-xl">ยืนยันข้อมูล</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!readyFetch}
              className={`${
                !readyFetch ? 'bg-[#D9F2EB]' : 'bg-[#27AA83]'
              } h-[40] w-[150] mt-8 self-center rounded-2xl items-center justify-center space-y-2`}
              onPress={startFetch}>
              <Text className="text-white font-bold text-xl">แจ้งปัญหา</Text>
            </TouchableOpacity>
          </View>
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
