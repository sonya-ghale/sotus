<script lang="ts">
import type {Snippet} from "svelte";

const {button} = $props<{
    button?: Snippet<[]>;
}>();
</script>

<div>
    {#if button}
    {@render button()}
    {/if}
</div>