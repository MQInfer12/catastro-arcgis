<script lang="ts">
  import Map from '@arcgis/core/Map';
  import MapView from '@arcgis/core/views/MapView';
  import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
  import "@arcgis/core/assets/esri/themes/light/main.css";

  interface DataLayer {
    name: string,
    active: boolean,
    layer: any
  }

  let centerText: string;
  const dataLayers: DataLayer[] = [{
    name: "Demografia",
    active: false,
    layer: new WMSLayer({
      url: "http://186.121.246.218:6080/arcgis/services/catastro/DEM_500/MapServer/WMSServer"
    })
  }, {
    name: "OTBs",
    active: false,
    layer: new WMSLayer({
      url: "http://186.121.246.218:6080/arcgis/services/planificacion/otbsDb/MapServer/WMSServer"
    })
  }, {
    name: "Manzanas",
    active: false,
    layer: new WMSLayer({
      url: "http://186.121.246.218:6080/arcgis/services/catastro/manzanasWms/MapServer/WMSServer"
    })
  }, {
    name: "Calles",
    active: false,
    layer: new WMSLayer({
      url: "http://186.121.246.218:6080/arcgis/services/planificacion/viasWms/MapServer/WMSServer"
    })
  }]

  const handleToggleLayer = (index: number) => {
    dataLayers[index].active = !dataLayers[index].active;
  }

  const map = new Map({
    basemap: "gray-vector",
  });

  const createMap = (domNode: string | HTMLDivElement | undefined) => {
    const view = new MapView({
      container: domNode,
      map: map,
      zoom: 13,
      center: [-66.15697627104832, -17.3938997748886]
    });

    view.watch("center", (center) => {
      const { latitude, longitude } = center;
      centerText = `Centro: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    });
  };

  $: dataLayers.forEach((l, i) => {
    if(l.active) {
      map.add(l.layer);
    } else {
      map.remove(l.layer);
    }
  })
</script>

<main>
  <div id="map" use:createMap></div>
  {#if centerText}
  <p>{centerText}</p>
  {/if}
  {#each dataLayers as layer, i}
  <button on:click={() => handleToggleLayer(i)}>
    Capa {layer.name}: {#if dataLayers[i].active} ON {:else} OFF {/if}
  </button>
  {/each}
</main>

<style>
  #map {
    height: 500px;
    width: 500px;
  }
</style>
