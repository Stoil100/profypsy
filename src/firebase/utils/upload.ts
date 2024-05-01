import {
    getDownloadURL,
    ref,
    updateMetadata,
    uploadBytes,
} from "firebase/storage";
import { storage } from "../config";

export const uploadImage = async (
    file: Blob | ArrayBuffer | File | undefined,
    fileName: string,
) => {
    try {
        const imageRef = ref(storage, `images/${fileName}`);
        const uploadImage = await uploadBytes(imageRef, file!);
        const newMetadata = {
            cacheControl: "public,max-age= 7890000000", //3 mins - test / 3 months - 7890000000
            contentType: uploadImage.metadata.contentType,
        };

        await updateMetadata(imageRef, newMetadata);
        return await getDownloadURL(imageRef);
    } catch (error) {
        throw error;
    }
};
