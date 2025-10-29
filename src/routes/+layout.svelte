<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/Navbar.svelte';
  import { settings, Button } from 'svelte-ux';

  // Configure svelte-ux settings
  settings({
    themes: {
      light: ['light'],
      dark: ['dark']
    }
  });

  let { children } = $props();
</script>

<div class="app">
  <Navbar />
  
  <main>
    {@render children()}
  </main>
  
  <!-- Test button - should work properly now -->
  <Button variant="fill" color="primary" rounded="full" class="m-4">
    Test Button
  </Button>
  
  <footer>
    <p>Powered by MangaDex</p>
  </footer>
</div>

<style>
  /* .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  } */

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  } 

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>