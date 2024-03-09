"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Languages } from 'lucide-react'

type LanguageT= "БГ"|"EN"

export default function LanguageButton() {
    const [language,setLanguage]=useState<LanguageT>("БГ");
  return (
    <Button onClick={() => setLanguage(language === "БГ" ? "EN" : "БГ")} variant="outline" className='flex justify-between items-center p-1 w-16 h-fit text-white bg-transparent'>
        <Languages/>
        <p>{language}</p>
    </Button>
  )
}
