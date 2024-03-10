import * as database from "$lib/database";

import * as Card from "$lib/components/ui/card";

const DATABASE_FILE_NAME = "discloud-lock.txt";
let databaseFileId: string;
let webhook: string;

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken(null);
    }
}

export async function initDatabase() {
    const fileId = await fileExists(DATABASE_FILE_NAME);

    if (fileId) {
        databaseFileId = fileId;
        webhook = await getWebhookUrl();
    } else {
        databaseFileId = await createDatabaseFile();
    }

    database.init(await getDatabaseContent());

    // await test();
}

async function test() {

}

export async function createDatabaseFile(): Promise<string> {
    const response = await gapi.client.drive.files.create({
        resource: {
            "name": DATABASE_FILE_NAME,
            "mimeType": "text/plain"
        }
    });

    const webhookLine = "webhookUrl: null";

    await updateDatabaseContent(webhookLine);

    return response.result.id ?? "";
}

export async function fileExists(fileName: string): Promise<string | undefined> {
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

export async function updateDatabaseContent(content: string) {
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

export async function addWebhook(webhookUrl: string) {
    webhook = webhookUrl;
    await updateDatabaseContent(database.fileString);
}

export async function getWebhookUrl() {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: databaseFileId,
            alt: "media"
        });
        let webhookLine = response.body.split("\n")[0];
        webhookLine = webhookLine.substring(webhookLine.lastIndexOf(":") + 2)

        return webhookLine;
    } catch (error) {
        console.error(error);
        return "";
    }
}

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