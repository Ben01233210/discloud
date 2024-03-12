
<script lang="ts">
// die site falls der user eine falsche url eingibt
    import { page } from '$app/stores';
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
