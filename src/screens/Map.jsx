import React, { useEffect, useState } from 'react'
import MapView, { Polyline, Marker } from 'react-native-maps'

const Map = () => {
  const [eMakers, setEMaker] = useState([])
  const [tMakers, setTMaker] = useState([])

  const [eMakesIsReady, setEMakesIsReady] = useState(false)
  const [tMakesIsReady, setTMakesIsReady] = useState(false)

  const fetchEMGReportMarker = async () => {
    try {
      const response = await fetch('{Your-Domain-Server}/get-emgr-marks')
      const json = await response.json()

      setEMaker(json)
      setEMakesIsReady(true)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTFPReportMarker = async () => {
    try {
      const response = await fetch('{Your-Domain-Server}/get-tfpr-marks')
      const json = await response.json()

      setTMaker(json)
      setTMakesIsReady(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchEMGReportMarker()
  }, [])

  useEffect(() => {
    fetchTFPReportMarker()
  }, [])

  return (
    <MapView
      className="absolute top-0 left-0 right-0 bottom-0"
      showsUserLocation={true}
      showsMyLocationButton={false}
      zoomEnabled={true}
      initialRegion={{
        latitude: 18.765347, // 18.765347
        longitude: 99.076587, // 99.076587
        latitudeDelta: 0.115,
        longitudeDelta: 0.12,
      }}>
      <Polyline
        coordinates={[
          { latitude: 18.783377, longitude: 99.027215 },
          { latitude: 18.780557, longitude: 99.041464 },
          { latitude: 18.776888, longitude: 99.056972 },
          { latitude: 18.771206, longitude: 99.067805 },
          { latitude: 18.751263, longitude: 99.107743 },
          { latitude: 18.745308, longitude: 99.119187 },
          { latitude: 18.741451, longitude: 99.123904 },
          { latitude: 18.739756, longitude: 99.124706 },
        ]}
        strokeColor="#0C71E0" // fallback for when `strokeColors` is not supported by the map-provider
        strokeWidth={4}
      />

      {eMakesIsReady
        ? eMakers.map(maker => {
            return (
              <Marker
                key={maker.id}
                title={maker.accident_info}
                coordinate={{
                  latitude: parseFloat(maker.lnt),
                  longitude: parseFloat(maker.lng),
                }}></Marker>
            )
          })
        : null}
      {tMakesIsReady
        ? tMakers.map(maker => {
            return (
              <Marker
                pinColor="yellow"
                key={maker.id}
                title={maker.problem_category}
                coordinate={{
                  latitude: parseFloat(maker.lnt),
                  longitude: parseFloat(maker.lng),
                }}
              />
            )
          })
        : null}
    </MapView>
  )
}

export default Map
