<script lang="ts">
    import type { Comuna } from "../../../interfaces/ComunaJSON";
  import type { Distrito } from "../../../interfaces/DistritoJSON";
  import type {
    SearchOption,
    TypeSearch,
  } from "../../../interfaces/SearchOption";
  import type { Subdistrito } from "../../../interfaces/SubdistritoJSON";
  import Table from "./Table.svelte";

  // ======== PARAMS ========
  export let handleFun: (close?: boolean) => void;
  export let distritosData: Distrito[];
  export let subdistritosData: Subdistrito[];
  export let comunasData: Comuna[];
  export let searchBy: SearchOption;
  export let searchByTypeVar: TypeSearch;
  export let distritosDataClick: Distrito;
</script>

<div id="myModal" class="modal">
  <button class="close-button" on:click={() => handleFun(true)}>
    <div>&nbsp;</div>
  </button>
  <div class="modal-content">
    {#if searchByTypeVar == "distrito"}
      <Table {searchBy} data={distritosData[0].properties} />
    {/if}
    {#if searchByTypeVar == "subdistrito"}
      <Table {searchBy} data={subdistritosData[0].properties} />
    {/if}
    {#if searchByTypeVar == "distritoByClick"}
      <Table {searchBy} data={distritosDataClick.properties} />
    {/if}
    {#if searchByTypeVar == "comuna"}
      <Table {searchBy} data={comunasData[0].properties} />
    {/if}
  </div>
</div>

<style lang="scss">
  .modal {
    display: flex;
    position: fixed;
    bottom: 0px;
    left: 0%;
    z-index: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 30%;
    animation: transitionMove 1s;
    isolation: isolate;
  }

  @keyframes transitionMove {
    0% {
      transform: translateY(250px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  /* Style for the modal content */
  .modal-content {
    background-color: var(--gray-50);
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: relative;
    min-width: 100%;
    min-height: 100%;
  }

  /* Style for the close button */
  .close-button {
    position: absolute;
    top: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 1;
    border: none;
    background-color: transparent;
  }

  .close-button div {
    background-color: var(--gray-300);
    width: 50px;
    border-radius: 10px;
    height: 5px;
  }
</style>
