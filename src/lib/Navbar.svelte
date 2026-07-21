<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/animation', label: 'Animation' },
		{ href: '/manga-tag', label: 'Genres' }
	];

	function isActive(href: string): boolean {
		if (href === '/manga-tag') {
			return page.url.pathname.startsWith('/manga-tag');
		}
		return page.url.pathname === href;
	}
</script>

<header class="bg-gray-800 text-white shadow-md">
	<nav class="container mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4">
		<a href="/" class="group">
			<p class="text-xl font-bold tracking-wide group-hover:text-gray-200">SOTUS</p>
			<p class="text-sm text-gray-400 group-hover:text-gray-300">Read manga online with me</p>
		</a>

		<ul class="flex items-center gap-6">
			{#each links as { href, label }}
				<li aria-current={isActive(href) ? 'page' : undefined}>
					<a
						{href}
						class="rounded px-2 py-1 font-semibold transition-colors hover:text-gray-200"
						class:text-white={isActive(href)}
						class:text-gray-400={!isActive(href)}
						class:underline={isActive(href)}
						class:decoration-2={isActive(href)}
						class:underline-offset-4={isActive(href)}
					>
						{label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>
