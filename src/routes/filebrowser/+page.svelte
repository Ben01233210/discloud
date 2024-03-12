<script lang="ts">
    import DataTable from "./data-table.svelte";
    import {onMount} from 'svelte';
    import * as googleDriveTransfer from "$lib/googleDriveTransfer";

    import {getBasefile } from "$lib/database";
    import dataStore from "./file-store";

    console.log(getBasefile());

    // die Google Drive API Konfigurationen
    const CLIENT_ID = "410214321825-o40h4kkrj2j6cnuguu88qn4i3f7ve5fg.apps.googleusercontent.com";
    const API_KEY = "AIzaSyAieD4rFf6p0GTutU8VGB1uT4PBX7RHWL4";
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
    const SCOPES = 'https://www.googleapis.com/auth/drive';

    let tokenClient: GoogleApiOAuth2TokenObject;
    let gapiInited = false;
    let gisInited = false;

    /**
     * Läd die Bibliotheken neu, da die Page reloaded wurde
     * Führe die gapiLoaded() und gisLoaded() Funktion aus nachdem die Google Bibliotheken geladen wurden
     */
    onMount(() => {
        loadScript('https://apis.google.com/js/api.js', gapiLoaded);
        loadScript('https://accounts.google.com/gsi/client', gisLoaded);
    });

    /**
     * Führe die gapiLoaded() und gisLoaded() Funktion aus nachdem die Google Bibliotheken geladen wurden
     */
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = src;
        script.onload = callback;
        document.body.appendChild(script);
    }

    /**
     * Callback nachdem die api.js Bibliothek geladen wurde
     */
    function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
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
        maybeInitDatabase().then();

        const authToken = getCookie('auth_token');
        if (authToken) {
            gapi.client.setToken({access_token: authToken});
        }
    }

    /**
     * Callback nachdem die Google Identifikations Dienste geladen sind
     */
    function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined later
        });
        gisInited = true;
        maybeInitDatabase().then();
    }

    /**
     * initialisiert die Datenbank, wenn die Bibliotheken geladen wurden
     */
    async function maybeInitDatabase() {
        if (gapiInited && gisInited) {
            await googleDriveTransfer.initDatabase();
            getBasefile().then((args) => {dataStore.set(args.child ? args.child : []); })
            console.log("Database maybe inited");
                    

        }
    }

    /**
     * Gibt einen Cookie zurück
     * @param name der name des Cookies
     */
    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
</script>

<DataTable />
