<script lang="ts">
  export let handleClick: () => any
  export let icon: string;
</script>

<button on:click={(handleClick)}>
  <i class={icon}></i>
</button>

<style lang="scss">
  button {
    height: 40px;
    min-width: 40px;
    border-radius: 20px;
    background-color: var(--white);
    border: 1px solid var(--gray-200);
    position: relative;
    z-index: 1;
    & > i {
      color: var(--gray-400);
      font-size: 16px;
    }
  }
</style>