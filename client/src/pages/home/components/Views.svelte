<script lang="ts">
  import Map from "@arcgis/core/Map";
  import { distritos } from "../../../storage/mapData";
  import type { DistritoJSON } from "../../../interfaces/DistritoJSON";
  import MapView from "@arcgis/core/views/MapView";
  import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
  import type { TypeColor } from "../../../interfaces/SearchOption";
  import Graphic from "@arcgis/core/Graphic.js";
  import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

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
  let graphicsLayer: GraphicsLayer;
  let active: "distritos" | null = null;
  
  const handleDistritos = () => {
    map.removeAll();
    active = "distritos";
    const blob = new Blob([JSON.stringify(distritosData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const cssColor1 = getComputedStyle(document.documentElement).getPropertyValue('--green-1');
    const hexColor1 = cssColor1.replace('#', '');
    const r1 = parseInt(hexColor1.slice(0, 2), 16);
    const g1 = parseInt(hexColor1.slice(2, 4), 16);
    const b1 = parseInt(hexColor1.slice(4, 6), 16);
    const cssColor2 = getComputedStyle(document.documentElement).getPropertyValue('--green-2');
    const hexColor2 = cssColor2.replace('#', '');
    const r2 = parseInt(hexColor2.slice(0, 2), 16);
    const g2 = parseInt(hexColor2.slice(2, 4), 16);
    const b2 = parseInt(hexColor2.slice(4, 6), 16);
    geoJsonLayer = new GeoJSONLayer({
      url: url,
      renderer: {
        //@ts-ignore
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [r1, g1, b1, 0.4],
          outline: {
            color: [r2, g2, b2, 0.6],
            width: 1
          }
        }
      }
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
          //@ts-ignore
          const graphic = res.results[0].graphic;
          const newSymbol = {
            type: "simple-fill",
            color: [r1, g1, b1, 1],
            outline: {
              color: [r2, g2, b2, 1],
              width: 1
            }
          }
          map.remove(graphicsLayer);
          graphicsLayer = new GraphicsLayer({
            graphics: [new Graphic({
              geometry: graphic.geometry,
              symbol: newSymbol,
              attributes: graphic.attributes
            })]
          });
          map.add(graphicsLayer);
          const FID = graphic.attributes.FID;
          const distrito = distritosData.features.find(feature => feature.properties.FID === FID);
          console.log(distrito);
        }
      })
    });
  }

  interface DataButton {
    text: string
    handleClick: () => any
    color: TypeColor
  }

  const dataButtons: DataButton[] = [{
    text: "Distritos",
    handleClick: handleDistritos,
    color: "green"
  }]

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
    {#each dataButtons as button}
    <button 
      on:click={button.handleClick}
      class="view-button"
      style={`background-color: var(--${button.color}-1); opacity: ${active === "distritos" ? "1" : "0.6"};`}
    >{button.text}</button>
    {/each}
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