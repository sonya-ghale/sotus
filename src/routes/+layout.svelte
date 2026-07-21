<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/Navbar.svelte';
  import { page } from '$app/state';
  import { settings } from 'svelte-ux';

  // Configure svelte-ux settings
  settings({
    themes: {
      light: ['light'],
      dark: ['dark']
    }
  });

  let { children } = $props();

  const isReader = $derived(page.url.pathname.includes('/read/'));
</script>

<div class="app">
  {#if !isReader}
    <Navbar />
  {/if}
  
  <main>
    {@render children()}
  </main>
  
  {#if !isReader}

  {#if !isReader}
  <footer class="bg-[#1b0e0b] text-white py-8 px-4">
    <div class="max-w-6xl mx-auto flex flex-col items-center gap-3">
      <span class="text-2xl font-bold text-[#FDDBD3]">Sotus</span>
      <p class="text-sm text-white/70">Powered by MangaDex</p>
    </div>
  </footer>
{/if}
  {/if}
</div>

<style>
 
  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>