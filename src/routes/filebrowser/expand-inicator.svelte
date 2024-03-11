<script>
	export let isExpanded;
	export let canExpand;
	export let isAllSubRowsExpanded;
	export let depth;
</script>

{#if $canExpand}
	<span on:click={() => ($isExpanded = !$isExpanded)} style:--depth={depth}>
		{#if $isExpanded}
			{#if $isAllSubRowsExpanded}
				⬇️
			{:else}
				⏹️
			{/if}
		{:else}
			➡️
		{/if}
	</span>
{:else}
    <span style:--depth={depth}>•</span>
{/if}

<style>
	span {
		padding-left: calc(var(--depth) * 1rem);
	}
</style>


