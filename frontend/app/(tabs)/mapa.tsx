import React from "react"
import { View, StyleSheet } from "react-native"
import MapView, { Marker, Polyline } from "react-native-maps"

type Bin = {
  id: number
  name: string
  latitude: number
  longitude: number
  level: number
}

const bins: Bin[] = [
  { id: 1, name: "Praça Central", latitude: -29.466, longitude: -51.961, level: 30 },
  { id: 2, name: "Hospital", latitude: -29.468, longitude: -51.964, level: 92 },
  { id: 3, name: "Parque Municipal", latitude: -29.470, longitude: -51.960, level: 60 },
  { id: 4, name: "Shopping", latitude: -29.465, longitude: -51.963, level: 75 },
  { id: 5, name: "Rodoviária", latitude: -29.469, longitude: -51.958, level: 85 }
]

// base do caminhão
const depot = {
  latitude: -29.467,
  longitude: -51.962
}

// calcular distância simples
function distance(a: any, b: any) {
  return Math.sqrt(
    Math.pow(a.latitude - b.latitude, 2) +
    Math.pow(a.longitude - b.longitude, 2)
  )
}

// algoritmo de rota otimizada
function calculateRoute(bins: Bin[]) {

  const binsToCollect = bins.filter(bin => bin.level >= 70)

  let route: any[] = []
  let current = depot

  let remaining = [...binsToCollect]

  while (remaining.length > 0) {

    let nearest = remaining[0]
    let nearestIndex = 0

    remaining.forEach((bin, index) => {

      if (distance(current, bin) < distance(current, nearest)) {
        nearest = bin
        nearestIndex = index
      }

    })

    route.push(nearest)

    current = nearest

    remaining.splice(nearestIndex, 1)

  }

  return route
}

function getColor(level: number) {
  if (level > 80) return "red"
  if (level > 40) return "orange"
  return "green"
}

export default function Mapa() {

  const route = calculateRoute(bins)

  const routeCoordinates = [
    depot,
    ...route.map(bin => ({
      latitude: bin.latitude,
      longitude: bin.longitude
    }))
  ]

  return (

    <View style={styles.container}>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -29.467,
          longitude: -51.962,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >

        {/* BASE DO CAMINHÃO */}
        <Marker
          coordinate={depot}
          title="Base de Coleta"
          pinColor="blue"
        />

        {/* LIXEIRAS */}
        {bins.map((bin) => (

          <Marker
            key={bin.id}
            coordinate={{
              latitude: bin.latitude,
              longitude: bin.longitude
            }}
            title={bin.name}
            description={`Nível: ${bin.level}%`}
            pinColor={getColor(bin.level)}
          />

        ))}

        {/* ROTA OTIMIZADA */}
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="cyan"
        />

      </MapView>

    </View>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  map: {
    flex: 1
  }

})