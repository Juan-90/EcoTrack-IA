import React from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LineChart, BarChart } from "react-native-chart-kit"
import { ChartData } from "react-native-chart-kit/dist/HelperTypes"

const screenWidth = Dimensions.get("window").width

// Dados simulados de coletas semanais
const coletaData: ChartData = {
  labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  datasets: [
    {
      data: [12, 19, 10, 15, 20, 14, 9]
    }
  ]
}

// Dados simulados de nível médio das lixeiras
const nivelData = {
  labels: ["08h", "10h", "12h", "14h", "16h", "18h"],
  datasets: [
    {
      data: [20, 35, 50, 65, 70, 90]
    }
  ]
}

// Ranking de lixeiras críticas
const criticalBins = [
  { name: "Hospital", level: 92 },
  { name: "Praça Central", level: 88 },
  { name: "Parque Municipal", level: 81 }
]

// Simulação simples de previsão de enchimento (IA futura)
function predictFillTime(level: number) {
  const remaining = 100 - level
  const ratePerHour = 10
  const hours = remaining / ratePerHour

  return `${hours.toFixed(1)}h`
}

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>EcoTrack IA</Text>
      <Text style={styles.subtitle}>Dashboard de Monitoramento</Text>

      {/* CARDS DE MÉTRICAS */}
      <View style={styles.cardsContainer}>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>42</Text>
          <Text style={styles.cardLabel}>Lixeiras Monitoradas</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>8</Text>
          <Text style={styles.cardLabel}>Lixeiras Cheias</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>17</Text>
          <Text style={styles.cardLabel}>Coletas Hoje</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>91%</Text>
          <Text style={styles.cardLabel}>Eficiência</Text>
        </View>

      </View>

      {/* GRÁFICO DE NÍVEL MÉDIO */}
      <Text style={styles.chartTitle}>Nível Médio das Lixeiras</Text>

      <LineChart
        data={nivelData}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: "#1e2923",
          backgroundGradientFrom: "#08130D",
          backgroundGradientTo: "#1b4332",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#fff",
          propsForBackgroundLines: {
            stroke: "#2d6a4f"
          }
        }}
        style={styles.chart}
      />

      {/* GRÁFICO DE COLETAS SEMANAIS */}
      <Text style={styles.chartTitle}>Coletas na Semana</Text>

      <BarChart
        data={coletaData}
        width={screenWidth - 32}
        height={220}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#08130D",
          backgroundGradientTo: "#1b4332",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: () => "#fff",
          propsForBackgroundLines: {
            stroke: "#2d6a4f"
          }
        }}
        style={styles.chart}
      />

      {/* PREVISÃO DE ENCHIMENTO */}
      <Text style={styles.chartTitle}>Previsão de Enchimento</Text>

      <View style={styles.predictionCard}>
        <Text style={styles.predictionText}>
          📍 Praça Central ficará cheia em ~{predictFillTime(70)}
        </Text>
      </View>

      <View style={styles.predictionCard}>
        <Text style={styles.predictionText}>
          📍 Parque Municipal ficará cheio em ~{predictFillTime(60)}
        </Text>
      </View>

      <View style={styles.predictionCard}>
        <Text style={styles.predictionText}>
          📍 Hospital ficará cheio em ~{predictFillTime(85)}
        </Text>
      </View>

      {/* RANKING DE LIXEIRAS CRÍTICAS */}
      <Text style={styles.chartTitle}>Lixeiras Críticas</Text>

      {criticalBins.map((bin, index) => (
        <View key={index} style={styles.predictionCard}>
          <Text style={styles.predictionText}>
            {index + 1}️⃣ {bin.name} → {bin.level}%
          </Text>
        </View>
      ))}

    </ScrollView>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#08130D",
    padding: 16
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff"
  },

  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20
  },

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  card: {
    backgroundColor: "#1b4332",
    width: "48%",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12
  },

  cardNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
  },

  cardLabel: {
    color: "#ccc",
    marginTop: 4
  },

  chartTitle: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10
  },

  chart: {
    borderRadius: 16
  },

  predictionCard: {
    backgroundColor: "#1b4332",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10
  },

  predictionText: {
    color: "#fff",
    fontSize: 14
  }

})