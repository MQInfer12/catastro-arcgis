<div>
  <input type="text">
  <i class="fa-solid fa-magnifying-glass"></i>
</div>

<style lang="scss">
  div {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }
  input {
    width: 100%;
    height: 40px;
    border: 1px solid var(--gray-200);
    border-radius: 20px;
    outline: none;
    padding: 0 44px 0 20px;
    color: var(--gray-400);
    font-size: 16px;
  }
  i {
    position: absolute;
    right: 16px;
    color: var(--gray-400);
    font-size: 18px;
    pointer-events: none;
  }
</style>