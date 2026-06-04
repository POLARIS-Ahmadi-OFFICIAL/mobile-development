import { View } from "react-native";

import { Button, StreamlitScreen, Tabs, TextField } from "@/components/ui";

export default function McpScreen() {
  return (
    <StreamlitScreen title="MCP Orchestrator" description="Literature MCP and hypothesis gating.">
      <Tabs
        items={[
          {
            label: "Config",
            content: <TextField label="Literature endpoint" placeholder="http://127.0.0.1:8000/mcp" />,
          },
          {
            label: "Tools",
            content: (
              <View>
                <TextField label="Search query" placeholder="Query papers…" />
                <Button label="Search papers" />
              </View>
            ),
          },
        ]}
      />
    </StreamlitScreen>
  );
}
