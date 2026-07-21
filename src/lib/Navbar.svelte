<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	const links = [
		{ href: '/', label: 'Browse' },
		// { href: '/animation', label: 'Latest' },
		{ href: '/genre', label: 'Genres' }
	];

	function isActive(href: string): boolean {
		if (href === '/genre') {
			return page.url.pathname.startsWith('/genre');
		}
		return page.url.pathname === href;
	}

	let scrolled = $state(false);
	let searchQuery = $state('');

	$effect(() => {
		if (browser) {
			searchQuery = page.url.searchParams.get('search') || '';
		}
	});

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') searchQuery = '';
	}

	function submitSearch(e: Event) {
		e.preventDefault();
		const q = searchQuery.trim();
		if (!q) return;
		goto(`/?search=${encodeURIComponent(q)}&page=1`);
	}
</script>

<header
	class="sticky top-0 z-50 transition-colors duration-300 {scrolled
		? 'bg-transparent border-transparent backdrop-blur-xl text-white'
		: 'bg-[#1b0e0b] backdrop-blur-xl border-outline-variant/20 text-white'}"
>
	<nav class="container mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4">
		<div class="flex items-center gap-10">
			<a href="/" class="group shrink-0">
				<span class="font-display-lg text-3xl font-extrabold text-[#FDDBD3] tracking-tight">Sotus</span>
			</a>

			<ul class="hidden md:flex items-center gap-8">
				{#each links as { href, label } (href)}
					<li aria-current={isActive(href) ? 'page' : undefined}>
						<a
							{href}
							class="font-label-lg text-label-lg pb-1 border-b-2 transition-colors duration-200"
							class:text-primary={isActive(href)}
							class:border-primary={isActive(href)}
							class:text-on-surface-variant={!isActive(href)}
							class:border-transparent={!isActive(href)}
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex items-center gap-2">
			<form onsubmit={submitSearch} class="flex items-center">
				<input
					bind:value={searchQuery}
					onkeydown={handleKeydown}
					type="text"
					placeholder="Search manga…"
					class="w-40 sm:w-64 bg-surface-container-lowest border border-none text-black focus:ring-0 text-on-surface font-body-md text-sm rounded-md pl-9 pr-4 py-2 transition-all duration-200"
				/>
				<button type="submit" class="p-2 rounded-md hover:bg-white/5 transition-colors">
				<span class="material-symbols-outlined text-on-surface-variant text-lg">search</span>
				</button>
			</form>
		</div>
	</nav>
</header>