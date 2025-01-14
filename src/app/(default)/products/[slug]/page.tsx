import { ProductDetailsPage } from "@/components/layouts/main/productdetails";

interface Params {
  slug: string;
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <div>
      <ProductDetailsPage slug={slug} />{" "}
    </div>
  );
}
