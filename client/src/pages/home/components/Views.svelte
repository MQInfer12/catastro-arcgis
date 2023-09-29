<script lang="ts">
  import Map from "@arcgis/core/Map";
  import { distritos } from "../../../storage/mapData";
  import type { DistritoJSON } from "../../../interfaces/DistritoJSON";
  import MapView from "@arcgis/core/views/MapView";
  import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

  export let handleOpen: () => any
  export let open: boolean
  export let map: Map
  export let view: MapView

  let distritosData: DistritoJSON;
  distritos.subscribe((val) => {
    if (val) {
      distritosData = val;
    }
  });

  let geoJsonLayer: GeoJSONLayer;
  let active: "distritos" | null = null;
  
  const handleDistritos = () => {
    map.removeAll();
    active = "distritos";
    const blob = new Blob([JSON.stringify(distritosData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    geoJsonLayer = new GeoJSONLayer({
      url: url,
    });
    map.add(geoJsonLayer);

    geoJsonLayer.when(() => {
      view.goTo({
        target: geoJsonLayer.fullExtent,
        duration: 2000,
        easing: "ease"
      })
    })

    view.on("click", (e) => {
      view.hitTest(e).then(res => {
        if(res.results.length > 0) {
          const layer = res.results[0].layer;
          console.log(layer);
        }
      })
    });
  }

  $: active = open ? active : null;
</script>

<div 
  class="container"
  style={`width: ${open ? "100%" : "auto"}`}
>
  <button class="icon-button" on:click={handleOpen}>
    {#if open}
    <i class="fa-solid fa-xmark"></i>
    {:else}
    <i class="fa-solid fa-eye"></i>
    {/if}
  </button>
  {#if open} 
  <div class="buttons">
    <button 
      on:click={handleDistritos}
      class="view-button"
      style={`background-color: var(--green-1); opacity: ${active === "distritos" ? "1" : "0.6"};`}
    >Distritos</button>
  </div>
  {/if}
</div>

<style lang="scss">
  .container {
    position: relative;
    overflow: hidden;
    border-radius: 20px 0 0 20px;
    min-width: 40px;
  }
  .icon-button {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background-color: var(--white);
    border: 1px solid var(--gray-200);
    position: relative;
    z-index: 1;
    & > i {
      color: var(--gray-400);
      font-size: 16px;
      animation: appearIcon 0.3s;
      @keyframes appearIcon {
        from {
          transform: rotate(-360deg);
        }
        to {
          opacity: rotate(0);
        }
      }
    }
  }
  .buttons {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    animation: fromLeft .3s;
    padding-left: 48px;

    @keyframes fromLeft {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
  }
  .view-button {
    height: 100%;
    padding: 0 16px;
    border-radius: 20px;
    border: none;
    color: var(--white);
    transition: all 0.3s;
  }
</style>