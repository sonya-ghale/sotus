<script lang="ts">
	// let mouse = $state({x: 0, y: 0});
	let mouse = $state<{ x: number; y: number } | null>({ x: 0, y: 0 });
</script>

<svelte:window
	onmousemove={(e) => {
		if (mouse) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		}
	}}
/>

<!-- <p>{mouse.x} running {mouse.y}</p> -->
<p>{mouse ? `${mouse.x} running ${mouse.y}` : 'Mouse is null'}</p>

<button onclick={() => (mouse = null)}> No click </button>
