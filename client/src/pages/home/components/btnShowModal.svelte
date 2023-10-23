<script lang="ts">
  import { fly } from "svelte/transition";
  import type { SearchOption } from "../../../interfaces/SearchOption";
  export let handleChangeStateModal: (close?: boolean) => void;
  export let searchBy: SearchOption;
</script>

<div transition:fly={{ y: 250, duration: 800 }} class="modal">
  <div class="modal-content">
    <button style={`background-color: var(--${searchBy.data.color}-1)`} on:click={() => handleChangeStateModal()}>Ver detalles</button>
  </div>
</div>

<style>
  .modal {
    display: flex;
    position: fixed;
    top: 80%;
    left: 32%;
    z-index: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 30%;
    isolation: isolate;
  }

  .modal-content {
    background-color: var(--gray-50);

    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: relative;
    border-radius: 15px;
  }

  button {
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    color: white;
    transition: background-color 0.3s;
  }
</style>
