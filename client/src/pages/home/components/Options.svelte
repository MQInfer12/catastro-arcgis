<script lang="ts">
  import type { SearchOption } from "../../../interfaces/SearchOption";

  export let options: SearchOption[];
  export let handleSearch: (option: SearchOption) => any;
  export let active: boolean;
</script>

{#if active}
<div class="container">
  {#each options as option}
    <button on:click={() => handleSearch(option)} class="row">
      <div>
        <small>{option.data.little}</small>
        <p>{option.data.text}</p>
      </div>
      <p style={`background-color: ${option.data.color}`}>{option.type}</p>
    </button>
  {/each}
</div>
{/if}

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--gray-200);
    max-height: 250px;
    overflow: auto;
    animation: appear 0.4s;

    @keyframes appear {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  .row {
    background-color: var(--white);
    border: none;
    display: flex;
    padding: 8px 16px;
    text-align: start;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--gray-100);
    }

    & > div {
      display: flex;
      flex-direction: column;

      & > small {
        color: var(--gray-400);
      }
      & > p {
        color: var(--gray-600);
        font-weight: 600;
      }
    }

    & > p {
      padding: 2px 4px;
      text-transform: capitalize;
      color: var(--white);
      border-radius: 4px;
    }
  }
</style>