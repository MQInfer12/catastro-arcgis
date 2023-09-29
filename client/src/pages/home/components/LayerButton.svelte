<script lang="ts">
  import type { DataLayer } from "../interfaces/DataLayer";

  export let layer: DataLayer;
  export let handleToggleLayer: () => void;
</script>

<button class="container" on:click={handleToggleLayer}>
  <img src={layer.img} alt={`layer-${layer.name}`}>
  {#if layer.active}
  <div class="bg" style={`background-color: ${layer.color}`} />
  <i class="fa-solid fa-check"></i>  
  {/if}
  <p style={`background-color: ${layer.color}`}>{layer.name}</p>
</button>

<style lang="scss">
  .container {
    position: relative;
    width: 40px;
    height: 40px;
    border: 2px solid var(--gray-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    & > .bg {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      opacity: 0.4;
    }
    & > i {
      position: absolute;
      color: var(--white);
      font-size: 20px;
      animation: appearActive 0.3s;
    }
    & > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    & > p {
      overflow: hidden;
      width: 100%;
      font-size: 12px;
      position: absolute;
      bottom: -8px;
      color: var(--white);
      border-radius: 7px;
    }

    @keyframes appearActive {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
  }
</style>