<script lang="ts">
// Haupt Inhalt der /filebrowser seite
    import {
        createTable,
        Render,
        Subscribe,
        createRender,
    } from "svelte-headless-table";
    import {
        addTableFilter,
        addSubRows,
        addExpandedRows,
    } from "svelte-headless-table/plugins";

    import { writable } from "svelte/store";
    import { getBasefile, type _File, type Folder, addFolder } from "$lib/database";
    import * as Table from "$lib/components/ui/table";

    import TableAktions from "./table-aktions.svelte";

    import { Input } from "$lib/components/ui/input";
    import ExpandInicator from "./expand-inicator.svelte";
    import { getDatabaseContent } from "$lib/googleDriveTransfer";
    import AddButton from "./add-button.svelte";
    import dataStore from "./file-store";
    import { onMount } from "svelte";



        

            



// erstellung der Table
    const table = createTable(dataStore, {
        expand: addExpandedRows(),
    // das gibt and bei welchen reihen es unterreihen geben darf
        sub: addSubRows({
            children: (row) => {
                if ("child" in row) {
                    return row.child ? row.child : [];
                } else {
                    return [];
                }
            },
        }),

        filter: addTableFilter({
            fn: ({ filterValue, value }) =>
                value.toLowerCase().includes(filterValue.toLowerCase()),
        }),
    });

// erstellung der Zeilekoepfe der Table
    const columns = table.createColumns([
        table.display({
            id: "expanded",
            header: "",
            cell: ({ row }, { pluginStates }) => {
                const { isExpanded, canExpand, isAllSubRowsExpanded } =
                    pluginStates.expand.getRowState(row);
            // weg um components in den einzelnen spalten zu rendern
            // der macht das man folder ausklappen kann
                return createRender(ExpandInicator, {
                    depth: row.depth,
                    isExpanded,
                    canExpand,
                    isAllSubRowsExpanded,
                });
            },
        }),
        table.column({
            accessor: "name",
            header: "Name",
        }),
        table.column({
            header: "",
            accessor: (path) => path,
            cell: ({ value }) => {
                return createRender(TableAktions, { file_folder: value });
            },
        }),
    ]);
    const {
        rows,
        headerRows,
        pageRows,
        tableAttrs,
        tableBodyAttrs,
        pluginStates,
    } = table.createViewModel(columns);
    const { filterValue } = pluginStates.filter;
    const { getRowState } = pluginStates.expand;
</script>
<!-- ui der Tabele-->
<div class="rounded-md border w-full">
    <div class="flex gap-20 py-4">
        <Input
            class="max-w-sm"
            placeholder="filter files and folders"
            type="text"
            bind:value={$filterValue}
        />
        <AddButton />
    </div>
    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe
                    rowProps={headerRow.props()}
                    rowAttrs={headerRow.attrs()}
                >
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe
                                attrs={cell.attrs()}
                                let:attrs
                                props={cell.props()}
                            >
                                <Table.Head {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
