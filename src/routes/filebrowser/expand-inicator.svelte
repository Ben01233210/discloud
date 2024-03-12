<script>
	export let isExpanded;
	export let canExpand;
	export let isAllSubRowsExpanded;
	export let depth;
</script>
<!-- je nach eingegebenen parametern wird angezeigt ob es sich um ein folder zum ausklappen handelt und dann wird dieser beim click ausgeklappt oder um ein leeren Folder oder ein gewoehnliches file dann wird ein punkt angezeigt -->
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


