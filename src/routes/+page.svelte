<script lang="ts">
    // das ist die Startseite

    import { Button } from "$lib/components/ui/button";
    import * as database from "$lib/database";
    import * as googleDriveTransfer from "$lib/googleDriveTransfer";

    import * as Card from "$lib/components/ui/card";

    import { onMount } from "svelte";
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";

    let databaseFileId: string;

    let authorizeButtonVisible = false;

    // die Google Drive API Konfigurationen

    const CLIENT_ID =
        "410214321825-o40h4kkrj2j6cnuguu88qn4i3f7ve5fg.apps.googleusercontent.com";
    const API_KEY = "AIzaSyAieD4rFf6p0GTutU8VGB1uT4PBX7RHWL4";
    const DISCOVERY_DOC =
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
    const SCOPES = "https://www.googleapis.com/auth/drive";

    let tokenClient: GoogleApiOAuth2TokenObject;
    let gapiInited = false;
    let gisInited = false;

    /**
     * Läd die Bibliotheken neu, da die Page reloaded wurde
     * Führe die gapiLoaded() und gisLoaded() Funktion aus nachdem die Google Bibliotheken geladen wurden
     */
    onMount(() => {
        loadScript("https://apis.google.com/js/api.js", gapiLoaded);
        loadScript("https://accounts.google.com/gsi/client", gisLoaded);
    });
    /**
     * Führe die gapiLoaded() und gisLoaded() Funktion aus nachdem die Google Bibliotheken geladen wurden
     */

    function loadScript(src, callback) {
        const script = document.createElement("script");
        script.async = true;
        script.defer = true;
        script.src = src;
        script.onload = callback;
        document.body.appendChild(script);
    }

    /**
     * Callback nachdem die Google Identifikations Dienste geladen sind
     */
    function gapiLoaded() {
        gapi.load("client", initializeGapiClient);
    }

    /**
     * Callback nachdem der API Client geladen wurde
     * Danach Lade die Discovery Dokumente um die API zu initialisieren

     */
    async function initializeGapiClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons().then();

        const authToken = getCookie("auth_token");
        if (authToken) {
            gapi.client.setToken({ access_token: authToken });
        }
    }

    /**
     * Callback nachdem die google Bibliothek geladen wurde
     */
    function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: "",
        });
        gisInited = true;
        maybeEnableButtons();
    }

    /**
     *  guckt ob die Bibliotheken geladen sind und wenn ja dann wird zur authentication Button enabled
     */
    async function maybeEnableButtons() {
        if (gapiInited && gisInited) {
            authorizeButtonVisible = true;
            // die Database wird initialisiert
            await googleDriveTransfer.initDatabase();
        }
    }

    /**
     * logt den user ein
     */
    async function handleAuthClick() {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw resp;
            }

            const authToken = resp.access_token;
            document.cookie = `auth_token=${authToken};max-age=3600;secure;samesite=strict`;

            await googleDriveTransfer.initDatabase();
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: "consent" });
        } else {
            tokenClient.requestAccessToken({ prompt: "" });
        }

        // wenn es ein Webhook gibt dann wird der user auf die filebrowser seite weitergeleitet
        // ansonsten auf die signup seite
        if (
            (await googleDriveTransfer.getWebhookUrl()) == "undefined" ||
            (await googleDriveTransfer.getWebhookUrl()) == ""
        ) {
            goto("/signup");
        } else {
            console.log(await googleDriveTransfer.getWebhookUrl());
            goto("/filebrowser");
        }
    }

    /**
     * Gibt einen Cookie zurück
     * @param name der name des Cookies
     */
    function getCookie(name: string) {
        let cookieArray = document.cookie.split(";");
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === " ") {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name + "=") === 0) {
                return cookie.substring(name.length + 1, cookie.length);
            }
        }
        return "";
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 60%;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        color: black;
        font-weight: bold;
        font-size: 30px;
        margin-bottom: 30px;
    }

    p {
        line-height: 1.6;
        margin-bottom: 15px;
        font-size: 20px;
    }
</style>

<div class="w-full h-full text-foreground">
    <div class="container">
        <Card.Root class="flex flex-col gap-2 m-4 p-4">
            <Card.Title class="text-center"> <h1>Discloud</h1></Card.Title>
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
</div>

