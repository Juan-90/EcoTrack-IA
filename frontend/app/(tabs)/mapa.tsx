import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import { getBins } from "@/src/services/binService";
import { Bin } from "@/src/types/bin";
import { useAppTheme } from "@/src/theme/ThemeContext";

function getMarkerColor(status: Bin["status"], colors: any) {
  if (status === "critical") return colors.danger;
  if (status === "warning") return colors.warning;
  if (status === "collected") return colors.info;
  return colors.accent;
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

  const [route, setRoute] = useState<Bin[] | null>(null);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

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

  const nextPriority = route
    ? route[0]
    : getNextPriorityBin(binsWithLocation);

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
    if (!binsWithLocation.length || !mapRef.current) return;

    const targetBin =
      binsWithLocation.find((bin) => bin.id === binId) ||
      nextPriority ||
      binsWithLocation[0];

    if (!targetBin?.location) return;

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

  function openBin(bin: Bin) {
    router.push(`/lixeira/${bin.id}`);
  }

  function focusBin(bin: Bin) {
    if (!bin.location || !mapRef.current) return;

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

  async function handleGenerateRoute() {
    if (route) return;

    setIsGeneratingRoute(true);

    try {
      const generatedRoute = binsWithLocation.slice(0, 5);
      setRoute(generatedRoute);
    } catch (error) {
      console.error("Erro ao gerar rota", error);
    } finally {
      setIsGeneratingRoute(false);
    }
  }

  function handleEndRoute() {
    setRoute(null);
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
              <View style={[styles.callout, { backgroundColor: colors.card }]}>
                <Text style={[styles.calloutTitle, { color: colors.text }]}>
                  {bin.name}
                </Text>
                <Text style={[styles.calloutText, { color: colors.textMuted }]}>
                  {bin.district} • {bin.level}%
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* 🔻 CONTROLE DE ROTA (SUBSTITUI A LEGENDA) */}
      <View
        style={[
          styles.routeControl,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {!route ? (
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={handleGenerateRoute}
            disabled={isGeneratingRoute}
          >
            {isGeneratingRoute ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Gerar minha rota
              </Text>
            )}
          </Pressable>
        ) : (
          <View style={styles.routeActive}>
            <Text style={[styles.routeText, { color: colors.text }]}>
              🚛 Rota em andamento
            </Text>

            <Pressable
              style={[styles.endButton, { backgroundColor: colors.danger }]}
              onPress={handleEndRoute}
            >
              <Text style={styles.primaryButtonText}>
                Encerrar rota
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  routeControl: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
  },

  routeActive: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routeText: {
    fontSize: 14,
    fontWeight: "800",
  },

  primaryButton: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  endButton: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },

  callout: {
    padding: 10,
    borderRadius: 10,
  },

  calloutTitle: {
    fontWeight: "800",
  },

  calloutText: {
    fontSize: 12,
  },
});