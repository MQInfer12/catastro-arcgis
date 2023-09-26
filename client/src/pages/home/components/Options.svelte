<script lang="ts">
  import type { SearchOption } from "../../../interfaces/SearchOption";

  export let options: SearchOption[];
  export let handleSearch: (option: SearchOption) => any;
</script>

<div>
  {#each options as option}
    <button on:click={() => handleSearch(option)}>{option.data.text}</button>
  {/each}
</div>

<style lang="scss">
  
</style>