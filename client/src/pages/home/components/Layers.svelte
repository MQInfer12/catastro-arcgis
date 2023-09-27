<script lang="ts">
  import type { DataLayer } from "../interfaces/DataLayer";
  import LayerButton from "./LayerButton.svelte";
  import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
  import LayerOTB from "../../../assets/images/layerOTB.png";
  import LayerDEM from "../../../assets/images/layerDEM.png";
  import LayerMAN from "../../../assets/images/layerMAN.png";

  let active = false;

  const dataLayers: DataLayer[] = [
    {
      name: "DEM",
      active: false,
      img: LayerDEM,
      color: "var(--yellow-1)",
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/catastro/DEM_500/MapServer/WMSServer",
      }),
    },
    {
      name: "OTBs",
      active: false,
      img: LayerOTB,
      color: "var(--red-1)",
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/planificacion/otbsDb/MapServer/WMSServer",
      }),
    },
    {
      name: "Manz",
      active: false,
      img: LayerMAN,
      color: "var(--purple-1)",
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/catastro/manzanasWms/MapServer/WMSServer",
      }),
    },
    /* {
      name: "Calles",
      active: false,
      img: "",
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/planificacion/viasWms/MapServer/WMSServer",
      }),
    }, */
  ];

  export let map: any;
  $: dataLayers.forEach((l, i) => {
    if (l.active) {
      map.add(l.layer);
    } else {
      map.remove(l.layer);
    }
  });

  const handleToggleLayer = (index: number) => {
    dataLayers[index].active = !dataLayers[index].active;
  };
</script>

<div class="container">   
  <button on:click={() => active = !active}>
    <i class="fa-solid fa-layer-group"></i>
  </button>
  <div class="layers-container">
    <div style={`transform: translateY(${active ? "0" : "-100%"})`}>
      <div class="layers-display">
        {#each dataLayers as layer, i}
          <LayerButton handleToggleLayer={() => handleToggleLayer(i)} layer={layer} />
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    position: relative;
    isolation: isolate;
  }
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
  .layers-container {
    position: absolute;
    width: 40px;
    height: 300px;
    top: 0;
    left: 0;
    border-radius: 20px 20px 0 0;
    z-index: 0;
    overflow: hidden;
    & > div {
      width: 100%;
      height: 100%;
      border-radius: 20px;
      transition: all 0.3s;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .layers-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding-top: 44px;
  }
</style>