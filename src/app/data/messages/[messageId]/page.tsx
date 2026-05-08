import { PayloadDetailScreen } from "@/features/data/_components/payload-detail-screen";

interface MessagePageProps {
  params: Promise<{ messageId: string }>;
}

export default async function MessagePage({ params }: MessagePageProps) {
  const { messageId } = await params;
  return <PayloadDetailScreen payloadId={messageId} />;
}
