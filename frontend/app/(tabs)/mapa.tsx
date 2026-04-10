import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { getBins } from "@/src/services/binService";
import { Bin } from "@/src/types/bin";
import { useAppTheme } from "@/src/theme/ThemeContext";

function getMarkerColor(status: Bin["status"], colors: any) {
  if (status === "critical") return colors.danger;
  if (status === "warning") return colors.warning;
  if (status === "collected") return colors.info;
  return colors.accent;
}

function getStatusLabel(status: Bin["status"]) {
  if (status === "critical") return "Prioridade alta";
  if (status === "warning") return "Atenção";
  if (status === "collected") return "Coletada";
  return "Normal";
}

function getNextPriorityBin(bins: Bin[]) {
  return bins.find(
    (bin) => bin.status === "critical" || bin.status === "warning"
  );
}

export default function MapaScreen() {
  const { theme } = useAppTheme();
  const { colors } = theme;
  const { binId } = useLocalSearchParams<{ binId?: string }>();

  const mapRef = useRef<MapView | null>(null);

  const [bins, setBins] = useState<Bin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const defaultRegion = useMemo<Region>(
    () => ({
      latitude: -22.4215,
      longitude: -45.4505,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    }),
    []
  );

  const binsWithLocation = bins.filter((bin) => bin.location);
  const nextPriority = getNextPriorityBin(binsWithLocation);

  const loadBins = useCallback(async () => {
    const data = await getBins();
    setBins(data);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await loadBins();
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [loadBins]);

  useEffect(() => {
    if (!binsWithLocation.length || !mapRef.current) {
      return;
    }

    const targetBin =
      binsWithLocation.find((bin) => bin.id === binId) ||
      nextPriority ||
      binsWithLocation[0];

    if (!targetBin?.location) {
      return;
    }

    mapRef.current.animateToRegion(
      {
        latitude: targetBin.location.latitude,
        longitude: targetBin.location.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      700
    );
  }, [binId, binsWithLocation, nextPriority]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadBins();
    setIsRefreshing(false);
  }

  function openBin(bin: Bin) {
    router.push(`/lixeira/${bin.id}`);
  }

  function focusBin(bin: Bin) {
    if (!bin.location || !mapRef.current) {
      return;
    }

    mapRef.current.animateToRegion(
      {
        latitude: bin.location.latitude,
        longitude: bin.location.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      700
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={defaultRegion}
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
            onPress={() => focusBin(bin)}
          >
            <Callout tooltip onPress={() => openBin(bin)}>
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
          styles.headerCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Mapa operacional
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Visualize e abra rapidamente a próxima coleta.
        </Text>
      </View>

      {nextPriority ? (
        <View
          style={[
            styles.priorityCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.priorityLabel, { color: colors.accent }]}>
            Próxima coleta
          </Text>
          <Text style={[styles.priorityName, { color: colors.text }]}>
            {nextPriority.name}
          </Text>
          <Text style={[styles.priorityMeta, { color: colors.textMuted }]}>
            {nextPriority.district} • {nextPriority.level}% •{" "}
            {nextPriority.routeName || "Rota do dia"}
          </Text>

          <View style={styles.priorityActions}>
            <Pressable
              style={[
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              onPress={() => focusBin(nextPriority)}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Destacar no mapa
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.primaryButton,
                { backgroundColor: colors.accent },
              ]}
              onPress={() => openBin(nextPriority)}
            >
              <Text style={styles.primaryButtonText}>Abrir coleta</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.legendCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.accent]}
              progressBackgroundColor={colors.card}
              tintColor={colors.accent}
            />
          }
          contentContainerStyle={styles.legendContent}
        >
          <View style={styles.legendItem}>
            <Ionicons name="location" size={16} color={colors.danger} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              Crítica
            </Text>
          </View>

          <View style={styles.legendItem}>
            <Ionicons name="location" size={16} color={colors.warning} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              Atenção
            </Text>
          </View>

          <View style={styles.legendItem}>
            <Ionicons name="location" size={16} color={colors.accent} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              Normal
            </Text>
          </View>

          <View style={styles.legendItem}>
            <Ionicons name="refresh" size={16} color={colors.info} />
            <Text style={[styles.legendText, { color: colors.text }]}>
              Puxe para atualizar
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCard: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  priorityCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 92,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    elevation: 4,
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  priorityName: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  priorityMeta: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  priorityActions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  legendCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 4,
  },
  legendContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 18,
    alignItems: "center",
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
