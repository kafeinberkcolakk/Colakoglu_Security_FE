import { ProductDetailScreen } from "@/features/data/_components/product-detail-screen";

interface ProductPageProps {
  params: Promise<{ productName: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productName } = await params;
  return <ProductDetailScreen productName={decodeURIComponent(productName)} />;
}
