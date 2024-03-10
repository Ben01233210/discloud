import * as database from "$lib/database";

import * as Card from "$lib/components/ui/card";

const DATABASE_FILE_NAME = "discloud-lock.txt";
let databaseFileId: string;

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
    } else {
        databaseFileId = await createDatabaseFile();
    }

    database.init(await getDatabaseContent());

    // await test();
}

async function test() {
    const testMessageId = "https://cdn.discordapp.com/attachments/1202216768748388402/1215760860728004759/0Test?ex=65fdec88&is=65eb7788&hm=ca00be2f0f8e4913542eecc0e1cd78fbc7391c22d848406300d5efec0bf238ce&";

    await database.addFolder("folder", "base");
    await database.addFolder("subfolder", "base/folder");
    await database.addFile("test_file", "base/folder/subfolder", [testMessageId]);
}

export async function createDatabaseFile(): Promise<string> {
    const response = await gapi.client.drive.files.create({
        resource: {
            "name": DATABASE_FILE_NAME,
            "mimeType": "text/plain"
        }
    });

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

export async function getWebhook(): Promise<string | null> {
    if (await fileExists(DATABASE_FILE_NAME) === undefined) {
        return null;
    }

    return "Error: not implemented";
}

export async function updateDatabaseContent(content: string) {
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

export async function getDatabaseContent() {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: databaseFileId,
            alt: "media"
        });

        return response.body;
    } catch (error) {
        console.error(error);
        return "";
    }
}