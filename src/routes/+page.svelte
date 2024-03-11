<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as database from "$lib/database";
    import * as googleDriveTransfer from "$lib/googleDriveTransfer";

    import * as Card from "$lib/components/ui/card";


    import {onMount} from 'svelte';
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";

    let databaseFileId: string;

    let authorizeButtonVisible = false;

    const CLIENT_ID = "410214321825-o40h4kkrj2j6cnuguu88qn4i3f7ve5fg.apps.googleusercontent.com";
    const API_KEY = "AIzaSyAieD4rFf6p0GTutU8VGB1uT4PBX7RHWL4";
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    const SCOPES = 'https://www.googleapis.com/auth/drive';

    let tokenClient: GoogleApiOAuth2TokenObject;
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
        maybeEnableButtons().then();

        const authToken = getCookie('auth_token');
        if (authToken) {
            gapi.client.setToken({access_token: authToken});
        }
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
    async function maybeEnableButtons() {
        if (gapiInited && gisInited) {
            authorizeButtonVisible = true;
            await googleDriveTransfer.initDatabase();
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    async function handleAuthClick() {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }

            const authToken = resp.access_token; // Assuming the token is in resp.access_token
            document.cookie = `auth_token=${authToken};max-age=3600;secure;samesite=strict`; // This sets a cookie that lasts for 1 hour

            await googleDriveTransfer.initDatabase();
                    
        };

        if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({prompt: ''});
        }

            if(await googleDriveTransfer.getWebhookUrl() == "undefined") {
             goto("/signup");
                        
            }
        else {
            goto("/filebrowser")
        }
    }

    function getCookie(name: string) {
        let cookieArray = document.cookie.split(';'); // Split the cookie string into individual cookies
        for(let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1); // Trim leading whitespace
            }
            if (cookie.indexOf(name + '=') === 0) {
                return cookie.substring(name.length + 1, cookie.length); // Extract and return the cookie value
            }
        }
        return ""; // Return empty string if the cookie is not found
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
        <Button on:click={handleAuthClick} disabled={!authorizeButtonVisible}
            >Login</Button
        >
    </Card.Root>
</div>

