"use client"

import { FormPageNavigation } from "@/components/form-page-navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-full mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900">Form Builder - Page Navigation</h1>
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden">
          <FormPageNavigation />
        </div>
      </div>
    </div>
  )
}
