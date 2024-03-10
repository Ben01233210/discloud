<script lang="ts">
    import DataTable from "./data-table.svelte";

    import {getBasefile } from "$lib/database";

    console.log(getBasefile());
    
</script>
<DataTable />
