import { ScrollView, View } from "react-native";

import { Metric, StreamlitScreen } from "@/components/ui";

export default function DashboardScreen() {
  return (
    <StreamlitScreen title="Dashboard" icon="📊">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3">
          <Metric label="CPU" value="—" />
          <Metric label="Memory" value="—" />
          <Metric label="Events" value="0" />
        </View>
      </ScrollView>
    </StreamlitScreen>
  );
}
