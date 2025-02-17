"use client";

import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  query,
  where,
  type WhereFilterOp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useFirestoreCollection<T>(
    collectionName: string,
    condition: [string, WhereFilterOp, any],
) {
    const [data, setData] = useState<T[]>([]);

    const [field, operator, value] = condition;

    useEffect(() => {
        const q = query(
            collection(db, collectionName),
            where(field, operator, value),
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempValues: T[] = [];
            querySnapshot.forEach((doc) => {
                tempValues.push({ id: doc.id, ...doc.data() } as T);
            });
            setData(tempValues);
        });

        return () => unsubscribe();
    }, [collectionName, field, operator, value]);

    return data;
}
