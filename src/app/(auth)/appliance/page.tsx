import ApplianceForm from '@/components/forms/appliance'
import React from 'react'

export default function Appliance
() {
  return (
    <main className='flex items-center justify-center w-full min-h-screen h-full py-[10vh] bg-[#0082FF20]'>
        <ApplianceForm className="lg:w-[700px] md:w-[600px] sm:w-[500px] w-full"/>
    </main>
  )
}
