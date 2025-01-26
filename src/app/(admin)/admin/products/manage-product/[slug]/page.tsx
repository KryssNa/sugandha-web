import { EditProduct } from '@/components/layouts/main/admin/EditProduct'

export default async function page({ params }: { params: { slug: string } }) {

  const { slug } = await params
  return (
    <div>
      <EditProduct slug={slug} />
    </div>
  )
}
