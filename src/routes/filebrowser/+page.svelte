<script lang="ts">
    import DataTable from "./data-table.svelte";
    import {onMount} from 'svelte';
    import * as googleDriveTransfer from "$lib/googleDriveTransfer";

    import {getBasefile } from "$lib/database";

    console.log(getBasefile());
    
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
        maybeInitDatabase().then();

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
        maybeInitDatabase();
    }

    /**
     * Enables user interaction after all libraries are loaded.
     */
    async function maybeInitDatabase() {
        if (gapiInited && gisInited) {
            await googleDriveTransfer.initDatabase();
        }
    }

    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
</script>
<DataTable />
