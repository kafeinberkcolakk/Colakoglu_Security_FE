import { SubjectDetailScreen } from "@/features/data/_components/subject-detail-screen";

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = await params;
  return <SubjectDetailScreen subject={decodeURIComponent(subject)} />;
}
