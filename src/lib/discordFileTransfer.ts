import axios from 'axios';
import {combineFileChunks, splitFileIntoChunks} from "./fileManager";
import FormData from 'form-data';

export async function uploadFile(webhookURL: string, blob: Blob, fileName: string): Promise<string[]> {
    let fileChunks = await splitFileIntoChunks(blob);

    return await uploadFiles(webhookURL, fileChunks, fileName);
}

export async function downloadFile(fileURLs: string[]): Promise<Blob> {
    let fileBlobs: Blob[] = [];

    for (let fileURL of fileURLs) {
        fileBlobs.push(await downloadSingleFile(fileURL));
    }

    return await combineFileChunks(fileBlobs);
}

async function uploadSingleFile(webhookURL: string, fileBlob: Blob, fileName: string): Promise<string> {
    const form = new FormData();

    form.append("file", fileBlob, fileName);

    try {
        const response = await axios.post(webhookURL, form);
        return response.data.attachments[0].url;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function uploadFiles(webhookURL: string, files: Blob[], fileName: string): Promise<string[]> {
    let fileURLs: string[] = [];
    let fileRawName = fileName.substring(0, fileName.lastIndexOf("."));
    let fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length);

    for (let i = 0; i < files.length; i++) {
        fileURLs.push(await uploadSingleFile(webhookURL, files[i], fileRawName + " (" + i + ")" + fileExtension));
    }

    return fileURLs;
}
async function downloadSingleFile(fileURL: string): Promise<Blob> {
    const response = await fetch(fileURL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.blob();
}

