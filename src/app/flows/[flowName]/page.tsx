import { notFound } from "next/navigation";
import { FlowDetailScreen } from "@/features/flows/_components/flow-detail-screen";

interface FlowDetailPageProps {
  params: Promise<{ flowName: string }>;
}

export default async function FlowDetailPage({ params }: FlowDetailPageProps) {
  const { flowName } = await params;
  const decoded = decodeURIComponent(flowName);
  if (decoded === "") {
    notFound();
  }
  return <FlowDetailScreen flowName={decoded} />;
}
