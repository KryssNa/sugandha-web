"use client"
import ProductManagement from '@/components/dashboard/admin/product/ProductManagement'
import { ModalProvider } from '@/components/shared/customModal/customModal'
import React from 'react'

export default function page() {
  return (
    <ModalProvider>
      <ProductManagement />
    </ModalProvider>
  )
}
