import * as database from "$lib/database";

import * as Card from "$lib/components/ui/card";
import { redirect } from "@sveltejs/kit";

const DATABASE_FILE_NAME = "discloud-lock.txt";
let databaseFileId: string;
let webhook: string;
let databaseInited = false;

/**
 * Initialisiert die Datenbank
 * Läd die Datenbank aus der Google Drive Textdatei oder erstellt eine neue
 */
export async function initDatabase() {
    if (!databaseInited) {
        const fileId = await getDatabaseId(DATABASE_FILE_NAME);

        // Wenn eine Datenbank existiert dann lade diese, ansonsten erstelle eine neue
        if (fileId) {
            databaseFileId = fileId;
            webhook = await getWebhookUrl();
        } else {
            await createDatabaseFile();
        }

        // Initialisiere die Datenbank funktionen und makiere die Datenbank als initialisiert
        database.init(await getDatabaseContent());
        databaseInited = true;
    }
    console.log("Database inited");
}

/**
 * Erstellt die Google Drive Textdatei Datenbank
 */
export async function createDatabaseFile() {
    // Die Http Anfrage an Google um eine Textdatei zu erstellen
    const response = await gapi.client.drive.files.create({
        resource: {
            "name": DATABASE_FILE_NAME,
            "mimeType": "text/plain"
        }
    });

    databaseFileId = response.result.id ?? "";

    // schreibt den Standard Datenbank Quellcode in die Datenbank
    const content = database.defaultDatabaseString;
    database.setFileString(content);

    // Aktualisiere die Google Drive Datei
    await updateDatabaseContent(content);
}

/**
 * Gibt die Datenbank Datei id aus Google Drive zurück, wenn diese existiert, ansonsten gibt es undefined zurück
 * @param fileName der DateiName der Datenbank
 */
export async function getDatabaseId(fileName: string): Promise<string | undefined> {
    // Http Anfrage um die Google Drive Datenbank zu finden
    const response = await gapi.client.drive.files.list({
        "q": `name='${fileName}' and trashed=false`,
        "spaces": "drive",
        "fields": "files(id)"
    });
    const files = response.result.files;

    if (files && files.length > 0) {
        return files[0].id;
    } else {
        return undefined;
    }
}

/**
 * Aktualisiert den Inhalt der Datenbank
 * @param content der Inhalt der Datenbank ohne der Webhook Url
 */
export async function updateDatabaseContent(content: string) {
    // Fügt den Webhook mit dem Inhalt zusammen
    content = "webhookUrl: " + webhook + "\n" + content;

    try {
        await gapi.client.request({
            path: `/upload/drive/v3/files/${databaseFileId}`,
            method: "PATCH",
            params: {
                uploadType: "media"
            },
            body: content
        });
    } catch (error) {
        console.error(error);
    }
}

/**
 * Fügt den Webhook zur Datenbank hinzu
 * @param webhookUrl die Webhook Url aus Discord
 */
export async function addWebhook(webhookUrl: string) {
    webhook = webhookUrl;
    await updateDatabaseContent(database.fileString);
}

/**
 * Gibt die Webhook Url aus der Google Drive Datenbank zurück
 */
export async function getWebhookUrl() {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: databaseFileId,
            alt: "media"
        });

        let webhookLine = response.body.split("\n")[0];
        webhookLine = webhookLine.substring(12);

        return webhookLine;
    } catch (error) {
        console.error(error);
        return "";
    }
}

/**
 * Gibt den Datenbank Inhalt ohne dem Webhook zurück
 */
export async function getDatabaseContent() {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: databaseFileId,
            alt: "media"
        });

        return response.body.split("\n").slice(1).join("\n");
    } catch (error) {
        console.error(error);
        return "";
    }
}
