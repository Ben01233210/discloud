<script lang="ts">
// Der Blaue Button Component
    import { Button } from "$lib/components/ui/button";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import {
        deleteItem,
        getSubfiles,
        type _File,
        type Folder,
        addFolder,
    } from "$lib/database";

    import { uploadFile } from "$lib/discordFileTransfer";
    import { getWebhookUrl } from "$lib/googleDriveTransfer";
    import CreateFolderDialog from "./create-folder-dialog.svelte";
    import * as database from "$lib/database";

    import tableContent from "./file-store";
    let rootFolder: Folder
    let dialog : CreateFolderDialog
    tableContent.subscribe((value) => {
        if (value.length > 0 && "child" in value[0]) {
            rootFolder = value[0];
        }
            
    });

    let files: FileList;
// immer wenn sich die Files aendern wird dieser block code gerunnt. Er laed die Files in discord und unsere interne datenbank hoch
    $: if (files) {
        getWebhookUrl().then((webhookUrl) => {
            for (const file of files) {
                uploadFile(webhookUrl, file, file.name).then((messageIds) => {
                    database.addFile(file.name, "base", messageIds);
                });

                const fileInTree: _File = {
                    name: file.name,
                    path: "/" + file.name,
                    parent: null,
                };

                tableContent.update((current) => current.concat([fileInTree]));
            }
        });
    }
</script>

<!-- input fuer die Files -->
<input bind:files hidden id="selector" multiple type="file" />
<!-- das Gesamte dropdownmenu-->
<DropdownMenu.Root>
    <!-- oeffnung des Dropdownmenus -->
    <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} class="rounded-full">+</Button>
  </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <!-- oeffnung des File Inputs-->
        <DropdownMenu.Item
            on:click={() => document.getElementById("selector")?.click()}
            >Add File</DropdownMenu.Item
        >
        <DropdownMenu.Item on:click={() => {dialog.openDialog()}}>Add Folder</DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
<!-- componet fuer den Dialog also das abfragen von dem Folder name. Es erscheint aber erst wenn dialog.openDialog() gerunnt wird -->
<CreateFolderDialog bind:this={dialog} rootFolder={rootFolder} />
