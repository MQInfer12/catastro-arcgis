<script lang="ts">
  import type { Comuna } from "../../../interfaces/ComunaJSON";
  import type { Distrito } from "../../../interfaces/DistritoJSON";
    import type { Educacion } from "../../../interfaces/EducacionJSON";
  import type { Salud } from "../../../interfaces/SaludJSON";
  import type {
    SearchOption,
  } from "../../../interfaces/SearchOption";
  import type { Subdistrito } from "../../../interfaces/SubdistritoJSON";
  import Table from "./Table.svelte";
  import { fly, fade } from "svelte/transition";

  // ======== PARAMS ========
  export let handleFun: (close?: boolean) => void;
  export let distritosData: Distrito[];
  export let subdistritosData: Subdistrito[];
  export let comunasData: Comuna[];
  export let saludData: Salud[];
  export let educacionData: Educacion[];
  export let searchBy: SearchOption;
</script>

<div class='modal-container'>
  <div transition:fly={{ y: 200, duration: 800 }} id="myModal" class="modal">
    <button class="close-button" on:click={() => handleFun(true)}>
      <div>&nbsp;</div>
    </button>
    <div class="modal-content">
      {#if searchBy.type == "distrito"}
        <Table {searchBy} data={distritosData[0].properties} />
      {/if}
      {#if searchBy.type == "subdistrito"}
        <Table {searchBy} data={subdistritosData[0].properties} />
      {/if}
      {#if searchBy.type == "comuna"}
        <Table {searchBy} data={comunasData[0].properties} />
      {/if}
      {#if searchBy.type == "salud"}
        <Table {searchBy} data={saludData[0].properties} />
      {/if}
      {#if searchBy.type == "educacion"}
        <Table {searchBy} data={educacionData[0].properties} />
      {/if}
    </div>
  </div>
  <button transition:fade={{ duration: 800 }} class='bg' on:click={() => handleFun(true)} />
</div>

<style lang="scss">
  .modal-container {
    position: fixed;
    inset: 0;
    isolation: isolate;
    z-index: 1001;
  }
  .bg {
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.3;
  }
  .modal {
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 1;
    width: 400px;
    align-items: center;
    justify-content: center;
    max-height: 400px;
    isolation: isolate;
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
