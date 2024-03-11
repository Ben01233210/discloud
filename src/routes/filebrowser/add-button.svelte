<script lang="ts">
    import { Button } from "$lib/components/ui/button";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { deleteItem, getSubfiles, type _File, type Folder } from "$lib/database";
    import { uploadFile } from "$lib/discordFileTransfer";
    import { getWebhookUrl } from "$lib/googleDriveTransfer";
    import tableContent from "./file-store";

    let files: FileList;
    $: if (files) {
        let webhookUrl = "";
        getWebhookUrl().then((url) => {
            webhookUrl = url;
        });
        for (const file of files) {
            uploadFile(webhookUrl,file,file.name).then((res) => {
                console.log(res);
            });
            
            const fileInTree : _File = {
                name: file.name,
                path: "/" + file.name,
                parent: null
            };
            tableContent.update((current) => current.concat([fileInTree]));

        }
    }
</script>
        <input bind:files hidden  id="selector" multiple type="file" />
<Button on:click={() => document.getElementById('selector')?.click()}>
    Upload File
</Button>
