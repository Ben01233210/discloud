<script lang="ts">
    import { Button } from "$lib/components/ui/button";

    import * as Card from "$lib/components/ui/card";

    

    import {onMount} from 'svelte';


    const DATABASE_FILE_NAME = "discloud-lock.txt";
    let databaseFileId: string;

    let authorizeButtonVisible = false;
    let signoutButtonVisible = false;

    const CLIENT_ID = "410214321825-o40h4kkrj2j6cnuguu88qn4i3f7ve5fg.apps.googleusercontent.com";
    const API_KEY = "AIzaSyAieD4rFf6p0GTutU8VGB1uT4PBX7RHWL4";
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    const SCOPES = 'https://www.googleapis.com/auth/drive';

    let tokenClient;
    let gapiInited = false;
    let gisInited = false;

    onMount(() => {
        loadScript('https://apis.google.com/js/api.js', gapiLoaded);
        loadScript('https://accounts.google.com/gsi/client', gisLoaded);
    });

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = src;
        script.onload = callback;
        document.body.appendChild(script);
    }

    /**
     * Callback after api.js is loaded.
     */
    function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
    }

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    async function initializeGapiClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
    }

    /**
     * Callback after Google Identity Services are loaded.
     */
    function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
    }

    /**
     * Enables user interaction after all libraries are loaded.
     */
    function maybeEnableButtons() {
        if (gapiInited && gisInited) {
            authorizeButtonVisible = true;
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick() {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            signoutButtonVisible = true;
            await initDatabase();
        };

        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({prompt: ''});
        }
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken(null);
            authorizeButtonVisible = false;
        }
    }

    async function initDatabase() {
        const fileId = await fileExists(DATABASE_FILE_NAME);

        if (fileId) {
            databaseFileId = fileId;
            console.log("found database");
        } else {
            databaseFileId = await createDatabaseFile();
            console.log("created new database");
        }

        console.log("initialized database");
    }

    async function createDatabaseFile(): Promise<string> {
        const response = await gapi.client.drive.files.create({
            resource: {
                "name": DATABASE_FILE_NAME,
                "mimeType": "text/plain"
            }
        });

        return response.result.id;
    }

    async function fileExists(fileName: string): Promise<string | null> {
        const response = await gapi.client.drive.files.list({
            "q": `name='${fileName}' and trashed=false`,
            "spaces": "drive",
            "fields": "files(id)"
        });
        const files = response.result.files;

        if (files && files.length > 0) {
            return files[0].id;
        } else {
            return null;
        }
    }

    export async function updateDatabaseContent(content: string) {
        try {
            return await gapi.client.request({
                path: `/upload/drive/v3/files/${databaseFileId}`,
                method: "PATCH",
                params: {
                    uploadType: "media"
                },
                body: content
            });
        } catch (error) {
            console.error(error);
            return null;
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
            return null;
        }
    }
</script>

<div class="w-full h-full text-foreground">
   <Card.Root class="flex flex-col gap-2 m-4 p-4">
        <Card.Title class="text-center">Discloud</Card.Title>
        <p>
            Discloud is a free cloud storage platform that allows you to
            securely store and access your files from anywhere. With Discloud,
            you can easily upload, organize, and share your documents, photos,
            videos, and more. Experience the convenience and flexibility of
            cloud storage with Discloud.
        </p>
        <Button on:click={handleAuthClick} disabled={!authorizeButtonVisible}>Login</Button>
    </Card.Root>
</div>
