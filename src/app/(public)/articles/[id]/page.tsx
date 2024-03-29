"use client"
import { ArticleT } from '@/components/schemas/article';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

export default function page({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState<ArticleT>();
    useEffect(() => {
        async function getUserData() {
            try {
                const docRef = doc(db, "articles", params.id);
                const docSnap = await getDoc(docRef);
                setArticle(docSnap.data()! as ArticleT);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        getUserData();
    }, []);
  return (
      <main className='pt-20 bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] h-fit w-full ">'>
          <div className='space-y-4 p-4 text-[#205041]'>
          <h2 className='text-4xl font-bold text-center'>{article?.title}</h2>
            <img src={article?.image}/>
          
            <div className='space-y-4'>
                {article?.descriptions.map(desc =>(
                    <div key={desc.descTitle} >
                        <h3 className='text-3xl'>{desc.descTitle}</h3>
                        <p className='px-4 text-lg'>{desc.description}</p>
                    </div>
                ))}
            </div>
          </div>
      </main>
  );
}
