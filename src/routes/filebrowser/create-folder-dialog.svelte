<script lang="ts">
    import { Button } from "$lib/components/ui/button";

    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { addFolder, type Folder } from "$lib/database";

    export function openDialog() {
        open = true;
    };
    export let rootFolder: Folder;
    let open = false;

    let folderName : string 
    function onSubmit() {
        open = false;
        addFolder(folderName,"base")
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger />
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Create Folder</Dialog.Title>
            <Dialog.Description>
                Create a new folder in 
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Name</Label>
                <Input id="name" bind:value={folderName}  class="col-span-3" />
            </div>
            <Dialog.Footer>
                <Button type="submit" on:click={onSubmit}>Create Folder</Button>
            </Dialog.Footer>
        </div></Dialog.Content
    >
</Dialog.Root>
