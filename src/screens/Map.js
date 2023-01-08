import React from 'react'
import MapView from 'react-native-maps'

export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <MapView
        className="absolute top-0 left-0 right-0 bottom-0"
        showsUserLocation={true}
        showsMyLocationButton={false}
        zoomEnabled={true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    )
  }
}
