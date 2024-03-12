<script lang="ts">
    import MoreHorizontal from "lucide-svelte/icons/more-horizontal";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import * as discordFileTransfer from "$lib/discordFileTransfer";
    import * as database from "$lib/database";
    import * as googleDriveTransfer from "$lib/googleDriveTransfer";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import CreateFolderDialog from "./create-folder-dialog.svelte";
    import type { _File } from "$lib/database";
    import tableContent from "./file-store";

    export let file_folder: database._File | database.Folder = {
        child: [],
        name: "base",
        path: "base",
        parent: null,
    } as database.Folder;
    let dialog: CreateFolderDialog;
    let files: FileList;

    async function downloadFile(path: string) {
        const urls = await database.getSubfiles(path);
        try {
            const response = await fetch("/api/downloadfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ urls }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            console.log("File size:", blob.size);

            // Trigger download
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "downloaded-file";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
        } catch (error) {
            console.error("Failed to download the file:", error);
        }
    }
    async function deleteItem(filePath: string) {
        await database.deleteItem(filePath);
        // TODO: delete file from website
    }
    function getRootFolder(): database.Folder {
        console.log(file_folder);
        if ("child" in file_folder) {
            return file_folder;
        } else {
            return {
                child: [],
                name: "base",
                path: "base",
                parent: null,
            } as database.Folder;
        }
    }

    $: if (files) {
        googleDriveTransfer.getWebhookUrl().then((webhookUrl) => {
            for (const file of files) {
                discordFileTransfer
                    .uploadFile(webhookUrl, file, file.name)
                    .then((messageIds) => {
                        const path = getRootFolder().path;
                        console.log(path);
                        database
                            .addFile(file.name, path, messageIds)
                            .then(() => console.log("File added"));
                    });


                database.getBasefile().then((args) => {
                    tableContent.set(args.child ? args.child : []);
                });
            }
        });
    }
</script>

<input bind:files hidden id="files" multiple type="file" />
<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button
            variant="ghost"
            builders={[builder]}
            size="icon"
            class="relative h-8 w-8 p-0"
        >
            <span class="sr-only">Open menu</span>
            <MoreHorizontal class="h-4 w-4" />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {#if "child" in file_folder}
            <DropdownMenu.Item on:click={() => dialog.openDialog()}>
                Create Folder</DropdownMenu.Item
            >

            <DropdownMenu.Item
                on:click={() => document.getElementById("files")?.click()}
                >Add File</DropdownMenu.Item
            >
        {:else}
            <DropdownMenu.Item on:click={() => downloadFile(file_folder.path)}
                >Download</DropdownMenu.Item
            >
            <DropdownMenu.Item on:click={() => deleteItem(file_folder.path)}
                >Delete</DropdownMenu.Item
            >
        {/if}
    </DropdownMenu.Content>
</DropdownMenu.Root>
<CreateFolderDialog bind:this={dialog} rootFolder={getRootFolder()} />
