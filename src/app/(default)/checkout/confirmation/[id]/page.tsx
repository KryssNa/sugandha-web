import ConfirmationPage from '@/components/sections/checkout/confirmationPage';
import { DynamicBreadcrumb } from '@/components/shared/breadcrumb/dynamicBreadcrumb';
import { useParams } from 'next/navigation';
import React from 'react'

export default async function page({ params }:{params:any}) {
    const { id } = await params;
  return (
    <>
    <DynamicBreadcrumb />
    <ConfirmationPage orderId={id} />
    </>
  )
}
