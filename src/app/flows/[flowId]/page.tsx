import { notFound } from "next/navigation";
import { FlowDetailScreen } from "@/features/flows/_components/flow-detail-screen";

interface FlowDetailPageProps {
  params: Promise<{ flowId: string }>;
}

export default async function FlowDetailPage({ params }: FlowDetailPageProps) {
  const { flowId } = await params;
  const numericId = Number.parseInt(flowId, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    notFound();
  }
  return <FlowDetailScreen flowId={numericId} />;
}
