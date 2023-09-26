<script lang="ts">
  import Map from "@arcgis/core/Map";
  import MapView from "@arcgis/core/views/MapView";
  import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
  import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
  import "@arcgis/core/assets/esri/themes/light/main.css";
  import { onMount } from "svelte";

  //MATERIAL UI

  import Autocomplete from "@smui-extra/autocomplete";
  interface DataLayer {
    name: string;
    active: boolean;
    layer: any;
  }

  let centerText: string;
  const dataLayers: DataLayer[] = [
    {
      name: "Demografia",
      active: false,
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/catastro/DEM_500/MapServer/WMSServer",
      }),
    },
    {
      name: "OTBs",
      active: false,
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/planificacion/otbsDb/MapServer/WMSServer",
      }),
    },
    {
      name: "Manzanas",
      active: false,
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/catastro/manzanasWms/MapServer/WMSServer",
      }),
    },
    {
      name: "Calles",
      active: false,
      layer: new WMSLayer({
        url: "http://186.121.246.218:6080/arcgis/services/planificacion/viasWms/MapServer/WMSServer",
      }),
    },
  ];

  const handleToggleLayer = (index: number) => {
    dataLayers[index].active = !dataLayers[index].active;
  };

  const map = new Map({
    basemap: "gray-vector",
  });

  $: dataLayers.forEach((l, i) => {
    if (l.active) {
      map.add(l.layer);
    } else {
      map.remove(l.layer);
    }
  });

  const createMap = (domNode: string | HTMLDivElement | undefined) => {
    const view = new MapView({
      container: domNode,
      map: map,
      zoom: 13,
      center: [-66.15697627104832, -17.3938997748886],
    });

    view.watch("center", (center) => {
      const { latitude, longitude } = center;
      centerText = `Centro: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    });
  };

  const url = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/1/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;
  const urlSubDistrictos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/3/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;

  // VARS
  let filter = ""; //search
  let geoJsonLayer: any;
  let distrito: any;

  let data: any;
  let dataSubDistrictos: any;
  let subDistricto: any;
  let allNameSubDistrictos: any=[];

  onMount(async () => {
    data = await fetch(url).then((res) => res.json());
    dataSubDistrictos = await fetch(urlSubDistrictos).then((res) => res.json());
    //console.log(dataSubDistrictos.features);

    for (let i = 0; i < dataSubDistrictos.features.length; i++) {
      const objeto = dataSubDistrictos.features[i];
      const nombre = objeto.properties.Nombre;
      allNameSubDistrictos[i] = nombre;
    }
    
    allNameSubDistrictos.push("Distrito: 1");

  });

  const handleSearch = () => {
    const indice = filter.indexOf(":");
    const searchBy = filter.substring(0, indice + ":".length);

    if (geoJsonLayer) {
      map.remove(geoJsonLayer);
    }

    let filteredFeatures;
    if (searchBy == "Distrito:") {
      filteredFeatures = data.features.filter(
        (feature: any) => feature.properties.Nombre === filter
      );
    }

    if (searchBy == "SubDistrito:") {
      console.log(filter);
      console.log(dataSubDistrictos.features[0]);
      filteredFeatures = dataSubDistrictos.features.filter(
        (feature: any) => feature.properties.Nombre === filter
      );
    }

    if (filteredFeatures.length === 0) {
      distrito = null;
      alert("No hay resultados");
      return;
    }
    distrito = filteredFeatures[0];
    const showData = {
      ...data,
      features: filteredFeatures,
    };
    const blob = new Blob([JSON.stringify(showData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    geoJsonLayer = new GeoJSONLayer({
      url: url,
    });
    map.add(geoJsonLayer);
  };
</script>

<main>
  <div>
    <div id="map" use:createMap />
    <div>
      {#each dataLayers as layer, i}
        <button on:click={() => handleToggleLayer(i)}>
          Capa {layer.name}: {dataLayers[i].active ? "ON" : "OFF"}
        </button>
      {/each}
    </div>
  </div>
  <div>
    {#if centerText}
      <p>{centerText}</p>
    {/if}
    <div>
      <p>Buscar por distrito:</p>
      <!--       <input type="text" bind:value={filter} /> -->

      {#if allNameSubDistrictos}
        <div class="columns margins">
          <div>
            <Autocomplete
              options={allNameSubDistrictos}
              textfield$variant="Filtrar"
              bind:value={filter}
            />

            <!--   <pre class="status">Selected: {filter || ""}</pre> -->
          </div>
        </div>
      {/if}

      <button on:click={handleSearch}>Buscar</button>
      {#if distrito}
        <div>
          <p>FID: {distrito.properties.FID}</p>
          <p>Nombre: {distrito.properties.Nombre}</p>
          <p>Distrito: {distrito.properties.distrito}</p>
          <p>Comuna: {distrito.properties.comuna}</p>
          <p>Área: {distrito.properties.Shape_Area}</p>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  #map {
    height: 500px;
    width: 500px;
  }

  main {
    display: flex;
    gap: 20px;
  }
</style>
