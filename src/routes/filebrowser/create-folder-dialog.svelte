<script lang="ts">
    import { Button } from "$lib/components/ui/button";

    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { addFolder, type Folder } from "$lib/database";
    import { getBasefile } from "$lib/database";
    import  data from "./file-store";
    export function openDialog() {
        open = true;
    }
    export let rootFolder: Folder = {name: "base", path: "base", child: [], parent: null}
    let open = false;

    let folderName: string;
    function onSubmit() {
        open = false;

        console.log(rootFolder.path);
        addFolder(folderName, rootFolder.path);
        

        getBasefile().then((args) => {data.set(args.child ? args.child : [])} )
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger />
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Create Folder</Dialog.Title>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Name</Label>
                <Input id="name" bind:value={folderName} class="col-span-3" />
            </div>
            <Dialog.Footer>
                <Button type="submit" on:click={onSubmit}>Create Folder</Button>
            </Dialog.Footer>
        </div></Dialog.Content
    >
</Dialog.Root>
