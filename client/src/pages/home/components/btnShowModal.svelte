<script lang="ts">
  export let handleChangeStateModal: (close?: boolean) => void;
</script>

<div class="modal">
  <div class="modal-content">
    <button on:click={() => handleChangeStateModal()}>Ver detalles</button>
  </div>
</div>

<style>
  @keyframes transitionMove {
    0% {
      transform: translateY(250px);
    }
    100% {
      transform: translateY(0px);
    }
  }
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
    animation: transitionMove 0.3s;
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
    border-radius: 15px;
    cursor: pointer;
    background-color: var(--gray-50);
  }
</style>
