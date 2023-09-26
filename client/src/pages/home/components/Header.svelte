<script lang="ts">
  import Logo from '../../../assets/images/logococha.png'
</script>

<header>
  <img src={Logo} alt="Cocha" />
  <slot />
</header>

<style lang="scss">
  header {
    position: absolute;
    z-index: 1000;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 40px;
    gap: 8px;
  }
  img {
    width: 116px;
  }
</style>