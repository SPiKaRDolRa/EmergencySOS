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
import { Input, CheckBox } from '@rneui/themed'
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
    victimVechicle: 'รถยนต์',
    hasParties: false,
    partyVehicle: 'รถยนต์',
    accidentInfo: 'เสียหลัก',
    otherInformation: '',
    assumption: 'ขับรถเร็วเกินอัตราที่กำหนด',
    img: '',
    lnt: '',
    lng: '',
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

    if (!formData.hasParties)
      setFormData(prev => ({ ...prev, partyVehicle: null }))

    if (formData.accidentInfo !== 'อื่นๆ')
      setFormData(prev => ({ ...prev, otherInformation: null }))
  }

  async function fetchReportEmergency() {
    return await fetch('http://35.213.137.95/create-emergency-report', {
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
        await fetchReportEmergency()

        Toast.show({
          type: 'success',
          text1: 'แจ้งอุบัติเหตุสำเร็จ',
          text2: 'ท่านได้แจ้งอุบัติเหตุเรียบร้อยแล้ว 👋',
        })
        navigation.goBack()
      },
    )
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
                  selectedValue={formData.partyVehicle}
                  onValueChange={itemValue =>
                    setFormData({ ...formData, partyVehicle: itemValue })
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

          <View className="mb-4">
            <Text className="ml-1 text-base font-bold text-black">
              ลักษณะการเกิดเหตุ
            </Text>
            <View className="border mx-3 border-[gray] rounded-2xl">
              <Picker
                placeholder="เลือกลักษณะการเกิดเหตุ"
                label="ลักษณะการเกิดเหตุ"
                selectedValue={formData.accidentInfo}
                onValueChange={itemValue =>
                  setFormData({ ...formData, accidentInfo: itemValue })
                }>
                <Picker.Item label="เสียหลัก" value="เสียหลัก" />
                <Picker.Item
                  label="เมาแล้วขับหลับใน"
                  value="เมาแล้วขับหลับใน"
                />
                <Picker.Item label="ยานพาหนะบกพร่อง" value="ยานพาหนะบกพร่อง" />
                <Picker.Item label="ชนประสานงา" value="ชนประสานงา" />
                <Picker.Item label="ชนท้าย" value="ชนท้าย" />
                <Picker.Item label="ชนด้านข้าง" value="ชนด้านข้าง" />
                <Picker.Item label="เฉี่ยวชน" value="เฉี่ยวชน" />
                <Picker.Item label="อื่นๆ" value="อื่นๆ" />
              </Picker>
            </View>
          </View>

          {formData.accidentInfo === 'อื่นๆ' ? (
            <Input
              placeholder="กรอกรายละเอียดเหตุการณ์"
              label="ลักษณะอื่นๆ"
              value={formData.otherInformation}
              onChange={e => {
                setFormData({
                  ...formData,
                  otherInformation: e.nativeEvent.text,
                })
              }}
              labelStyle={styles.inputLabelStyle}
              inputStyle={styles.inputStyle}
            />
          ) : null}

          <View className="mb-4">
            <Text className="ml-1 text-base font-bold text-black">
              มูลเหตุที่สันนิษฐาน
            </Text>
            <View className="border mx-3 border-[gray] rounded-2xl">
              <Picker
                placeholder="เลือกมูลเหตุที่สันนิษฐาน"
                label="มูลเหตุที่สันนิษฐาน"
                selectedValue={formData.assumption}
                onValueChange={itemValue =>
                  setFormData({ ...formData, assumption: itemValue })
                }>
                <Picker.Item
                  label="ขับรถเร็วเกินอัตราที่กำหนด"
                  value="ขับรถเร็วเกินอัตราที่กำหนด"
                />

                <Picker.Item
                  label="ตัดหน้าระยะกระชั้นชิด"
                  value="ตัดหน้าระยะกระชั้นชิด"
                />
                <Picker.Item
                  label="แซงรถอย่างผิดกฏหมาย"
                  value="แซงรถอย่างผิดกฏหมาย"
                />
                <Picker.Item
                  label="ขับรถไม่เปิดไฟ/ไม่ใช้แสงสว่างตามกำหนด"
                  value="ขับรถไม่เปิดไฟ/ไม่ใช้แสงสว่างตามกำหนด"
                />
                <Picker.Item
                  label="ไม่ให้สัญญาณจอด/ชลอ/เลี้ยว"
                  value="ไม่ให้สัญญาณจอด/ชลอ/เลี้ยว"
                />
                <Picker.Item
                  label="ฝ่าฝืนป้ายหยุดขณะออกจากท่างร่วมทางแยก"
                  value="ฝ่าฝืนป้ายหยุดขณะออกจากท่างร่วมทางแยก"
                />
                <Picker.Item
                  label="ฝ่าฝืนสัญญาณไฟ/เครื่องหมายจราจร"
                  value="ฝ่าฝืนสัญญาณไฟ/เครื่องหมายจราจร"
                />
                <Picker.Item
                  label="ไม่ขับรถในช่องทางเดินรถซ้ายสุดในถนนที่มี 4 ช่องทาง"
                  value="ไม่ขับรถในช่องทางเดินรถซ้ายสุดในถนนที่มี 4 ช่องทาง"
                />
              </Picker>
            </View>
          </View>

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
                + เพิ่มรูปภาพ{'\n'}สถานที่เกิดเหตุ
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
            เมื่อกดส่งข้อมูลแจ้งเหตุ แอพพลิเคชันจะเก็บข้อมูล ช่วงเวลา และ
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
              <Text className="text-white font-bold text-xl">แจ้งเหตุ</Text>
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
