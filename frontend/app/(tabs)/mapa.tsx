import { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import MapView, { Callout, Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { mockBins } from "@/src/mocks/bins";
import { useAppTheme } from "@/src/theme/ThemeContext";

function getMarkerColor(status: string, colors: any) {
  if (status === "critical") return colors.danger;
  if (status === "warning") return colors.warning;
  if (status === "collected") return colors.info;
  return colors.accent;
}

function getStatusLabel(status: string) {
  if (status === "critical") return "Prioridade alta";
  if (status === "warning") return "Atenção";
  if (status === "collected") return "Coletada";
  return "Normal";
}

export default function MapaScreen() {
  const { theme } = useAppTheme();
  const { colors } = theme;

  const initialRegion = useMemo(
    () => ({
      latitude: -22.4215,
      longitude: -45.4505,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    }),
    []
  );

  const binsWithLocation = mockBins.filter((bin) => bin.location);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        customMapStyle={
          theme.name === "dark"
            ? [
                { elementType: "geometry", stylers: [{ color: "#0b1510" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#08130D" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b4332" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f2a1d" }] },
                { featureType: "poi", elementType: "geometry", stylers: [{ color: "#102118" }] },
              ]
            : theme.name === "eco"
            ? [
                { elementType: "geometry", stylers: [{ color: "#ecfdf5" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#d1fae5" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#bfdbfe" }] },
                { featureType: "poi", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
              ]
            : []
        }
      >
        {binsWithLocation.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={{
              latitude: bin.location!.latitude,
              longitude: bin.location!.longitude,
            }}
            pinColor={getMarkerColor(bin.status, colors)}
          >
            <Callout tooltip onPress={() => router.push(`/lixeira/${bin.id}`)}>
              <View
                style={[
                  styles.callout,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.calloutTitle, { color: colors.text }]}>
                  {bin.name}
                </Text>
                <Text style={[styles.calloutText, { color: colors.textMuted }]}>
                  {bin.district} • {bin.level}%
                </Text>
                <Text
                  style={[
                    styles.calloutStatus,
                    { color: getMarkerColor(bin.status, colors) },
                  ]}
                >
                  Toque para abrir coleta
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View
        style={[
          styles.overlayCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.overlayTitle, { color: colors.text }]}>
          Mapa operacional
        </Text>
        <Text style={[styles.overlaySubtitle, { color: colors.textMuted }]}>
          Toque no marcador e depois no cartão para abrir a lixeira.
        </Text>
      </View>

      <View
        style={[
          styles.legendCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.legendItem}>
          <Ionicons name="location" size={16} color={colors.danger} />
          <Text style={[styles.legendText, { color: colors.text }]}>Crítica</Text>
        </View>

        <View style={styles.legendItem}>
          <Ionicons name="location" size={16} color={colors.warning} />
          <Text style={[styles.legendText, { color: colors.text }]}>Atenção</Text>
        </View>

        <View style={styles.legendItem}>
          <Ionicons name="location" size={16} color={colors.accent} />
          <Text style={[styles.legendText, { color: colors.text }]}>Normal</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  overlayCard: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  overlaySubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  legendCard: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendText: {
    fontSize: 13,
    fontWeight: "700",
  },
  callout: {
    minWidth: Math.min(Dimensions.get("window").width * 0.65, 240),
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    marginBottom: 4,
  },
  calloutStatus: {
    fontSize: 12,
    fontWeight: "800",
  },
});
