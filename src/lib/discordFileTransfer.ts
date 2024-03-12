import axios from 'axios';
import {combineFileChunks, splitFileIntoChunks} from "./fileManager";
import FormData from 'form-data';

/**
 * Läd eine Datei auf Discord hoch
 * @param webhookURL die webhook Url vom Discord Text Kanal
 * @param blob die hochzuladene Datei
 * @param fileName der Dateiname
 */
export async function uploadFile(webhookURL: string, blob: Blob, fileName: string): Promise<string[]> {
    let fileChunks = await splitFileIntoChunks(blob);

    return await uploadFiles(webhookURL, fileChunks, fileName);
}

/**
 * Läd alle auseinander gefügten Dateien herunter und gibt die kombinierte Datei zurück
 * @param fileURLs alle auseinander gefügten Datei Links
 */
export async function downloadFile(fileURLs: string[]): Promise<Blob> {
    let fileBlobs: Blob[] = [];

    for (let fileURL of fileURLs) {
        fileBlobs.push(await downloadSingleFile(fileURL));
    }

    return await combineFileChunks(fileBlobs);
}

/**
 * Läd eine einzelne Datei auf Discord hoch und gibt den Dateilink zurück
 * @param webhookURL die webhook Url vom Discord Text Kanal
 * @param fileBlob die hoch zuladene Datei
 * @param fileName der Datei Name
 */
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

/**
 * Läd alle auseinander gefügten Dateien auf Discord hoch
 * @param webhookURL die webhook Url vom Discord Text Kanal
 * @param files die Dateien die hochgeladen werden sollen
 * @param fileName der Datei Name
 */
async function uploadFiles(webhookURL: string, files: Blob[], fileName: string): Promise<string[]> {
    let fileURLs: string[] = [];
    let fileRawName = fileName.substring(0, fileName.lastIndexOf("."));
    let fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length);

    for (let i = 0; i < files.length; i++) {
        fileURLs.push(await uploadSingleFile(webhookURL, files[i], fileRawName + " (" + i + ")" + fileExtension));
    }

    return fileURLs;
}

/**
 * Läd eine einzelne Datei von Discord herunter
 * @param fileURL der Datei Link, die die Datei auf dem Discord Server hat
 */
async function downloadSingleFile(fileURL: string): Promise<Blob> {
    const response = await fetch(fileURL);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.blob();
}

