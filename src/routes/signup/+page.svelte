<script lang="ts">
    import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
    import { Input } from '$lib/components/ui/input';
</script>

<Card.Root class="flex flex-col gap-2 self-center justify-center justify-self-center m-4 p-4" >
    <Input placeholder="Webhook" />
            <Button >Connect with google</Button>
</Card.Root>
