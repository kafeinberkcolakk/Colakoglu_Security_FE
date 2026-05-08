import { CollectorDetailScreen } from "@/features/collectors/_components/collector-detail-screen";

interface CollectorDetailPageProps {
  params: Promise<{ collectorId: string }>;
}

export default async function CollectorDetailPage({
  params,
}: CollectorDetailPageProps) {
  const { collectorId } = await params;
  return <CollectorDetailScreen collectorId={collectorId} />;
}
