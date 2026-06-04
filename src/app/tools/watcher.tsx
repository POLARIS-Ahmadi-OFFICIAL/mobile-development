import { useState } from "react";
import { View } from "react-native";

import { Alert, Button, StreamlitScreen, Tabs, TextField } from "@/components/ui";

export default function WatcherScreen() {
  const [port, setPort] = useState("8000");

  return (
    <StreamlitScreen title="Watcher Control" icon="👀" description="Filesystem watcher for curve fitting.">
      <Tabs
        items={[
          {
            label: "Config",
            content: (
              <View>
                <TextField label="Watcher directory" placeholder="/path/to/watch" />
                <TextField label="Port" value={port} onChangeText={setPort} />
              </View>
            ),
          },
          {
            label: "Server",
            content: (
              <View className="gap-2">
                <Button label="▶️ Start Server" />
                <Button label="⏹️ Stop" variant="secondary" />
              </View>
            ),
          },
        ]}
      />
      <Alert variant="info">{`Server: http://localhost:${port}`}</Alert>
    </StreamlitScreen>
  );
}
