import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getBins } from "../src/services/binService";

export default function Home() {
  const [bins, setBins] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBins();
        setBins(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {bins.map((bin: any) => (
        <Text key={bin.id}>
          Lixeira {bin.id} - {bin.level}%
        </Text>
      ))}
    </View>
  );
}
