<script lang="ts">
	let {name = $bindable()} = $props();
</script>


<input type="" bind:value={name}/>
<button class="rounded-3xl bg-green-300 p-4 text-white hover:bg-green-700">{name}</button>
