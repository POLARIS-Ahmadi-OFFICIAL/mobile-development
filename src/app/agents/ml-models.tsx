import { Alert, Button, StreamlitScreen } from "@/components/ui";

export default function MlModelsScreen() {
  return (
    <StreamlitScreen title="ML Models" icon="🤖" description="Gaussian Process automation.">
      <Alert variant="info">POST /api/v1/agents/ml</Alert>
      <Button label="Run ML pipeline" />
    </StreamlitScreen>
  );
}
