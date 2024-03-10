import * as database from "$lib/database";

import * as Card from "$lib/components/ui/card";

const DATABASE_FILE_NAME = "discloud-lock.txt";
let databaseFileId: string;
let webhook: string;
let databaseInited = false;

// /**
//  *  Sign out the user upon button click.
//  */
// export function handleSignoutClick() {
//     const token = gapi.client.getToken();
//     if (token !== null) {
//         google.accounts.oauth2.revoke(token.access_token);
//         gapi.client.setToken(null);
//     }
// }

export async function initDatabase() {
    if (!databaseInited) {
        const fileId = await fileExists(DATABASE_FILE_NAME);

        if (fileId) {
            // console.log("found existing database");
            databaseFileId = fileId;
            webhook = await getWebhookUrl();
        } else {
            // console.log("create new database file");
            await createDatabaseFile();
        }

        database.init(await getDatabaseContent());
        databaseInited = true;

        // await test();
    }
}

async function test() {
    console.log("user logged in");
    getDatabaseContent().then((result) => {
        console.log(result);
    })
}

export async function createDatabaseFile() {
    const response = await gapi.client.drive.files.create({
        resource: {
            "name": DATABASE_FILE_NAME,
            "mimeType": "text/plain"
        }
    });

    databaseFileId = response.result.id ?? "";

    const content = database.defaultDatabaseString;
    database.setFileString(content);

    await updateDatabaseContent(content);
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