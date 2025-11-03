<script lang="ts">
	import { page } from '$app/state';
	import { ListItem } from 'svelte-ux';
	import { AppBar } from 'svelte-ux';
</script>

<header class="text-white bg-gray-400 shadow-md">
	<nav class="container px-6 py-4 mx-auto">
		<ul class="flex gap-10">
			<AppBar title="SOTUS" class="flex gap-4">
				<div slot="title">
					<ListItem title="SOTUS" class="text-xl" />
					<ListItem class="text-sm" subheading="Read manga online with me" />
				</div>
			</AppBar>
			<ul class="flex items-center justify-center gap-4">
				<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
					<a
						href="/"
						class="font-bold transition-colors duration-300"
						class:underline={page.url.pathname === '/'}>Home</a
					>
				</li>
				<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
					<a
						href="/about"
						class="font-bold transition-colors duration-300 "
						class:underline={page.url.pathname === '/about'}>About</a
					>
				</li>
				<li aria-current={page.url.pathname === '/demo' ? 'page' : undefined}>
					<a
						href="/demo"
						class="font-bold transition-colors duration-300"
						class:underline={page.url.pathname === '/demo'}>Demo</a
					>
				</li>
				<li>
						<a
						href="/manga-dex"
						class="font-bold transition-colors duration-300"
						class:underline={page.url.pathname === '/manga-dex'}>MangaDex</a
					>
				</li>
								<li>
						<a
						href="/animation"
						class="font-bold transition-colors duration-300"
						class:underline={page.url.pathname === '/animation'}>Animation</a
					>
				</li>
					
								<li>
						<a
						href="/manga-tag"
						class="font-bold transition-colors duration-300"
						class:underline={page.url.pathname === '/animation'}>Manga Tag</a
					>
				</li>
			</ul>
		</ul>
	</nav>
</header>
