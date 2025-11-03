<script lang="ts">
    import type {Snippet} from "svelte";

    const {header, title, subtitle} = $props<{
        header: Snippet<[{
            title: string;
            subtitle: string;
        },]>;
        title: string;
        subtitle: string;
    }>();
</script>

<div>
    {#if header}
    {@render header({title, subtitle})}
    {/if}
</div>