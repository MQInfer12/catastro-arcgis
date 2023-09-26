<script lang="ts">
  import { Route, Router } from 'svelte-routing'
  import Home from './pages/home/Index.svelte';

  export let url = "";
</script>

<Router {url}>
  <Route path="/" component={Home} />
</Router>