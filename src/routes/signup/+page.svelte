<script lang="ts">
// eine simple seite die den user die moeglichkeit gibt sich mit google drive zu verbinden
    
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
    import { Input } from '$lib/components/ui/input';
    import { addWebhook } from '$lib/googleDriveTransfer';
    let webhook: string = ""
// hier wird die Webhook der datenbank uebergeben
    function onConnect() {
        addWebhook(webhook)
        goto('/filebrowser')
            
    }
</script>

<Card.Root class="flex flex-col gap-2 self-center justify-center justify-self-center m-4 p-4" >
    <!-- das ist das Input fuer den Webhook -->
    <Input placeholder="Webhook" bind:value={webhook}  />
            <Button on:click={onConnect}>Connect with google</Button>
</Card.Root>
