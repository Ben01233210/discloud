<script lang="ts">
    import MoreHorizontal from "lucide-svelte/icons/more-horizontal";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import * as discordFileTransfer from "$lib/discordFileTransfer";
    import * as database from "$lib/database";
    import * as googleDriveTransfer from "$lib/googleDriveTransfer";

    export let path: string;

    async function downloadFile(path: string) {
        const urls = await database.getSubfiles(path)
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
</script>

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
        <DropdownMenu.Item on:click={() => downloadFile(path)}
            >Download</DropdownMenu.Item
        >
        <DropdownMenu.Item on:click={() => deleteItem(path)}
            >Delete</DropdownMenu.Item
        >
    </DropdownMenu.Content>
</DropdownMenu.Root>
