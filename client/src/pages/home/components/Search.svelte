<script lang="ts">
  import type { DistritoJSON } from "../../../interfaces/DistritoJSON";
  import { distritos, subdistritos } from "../../../storage/mapData";
  import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
  import Options from "./Options.svelte";
  import type { SubdistritoJSON } from "../../../interfaces/SubdistritoJSON";
  import type { SearchOption } from "../../../interfaces/SearchOption";
  import { searchOptions } from "../../../storage/searchOptions";

  let filter = "";

  let distritosData: DistritoJSON;
  let subdistritosData: SubdistritoJSON;

  distritos.subscribe(val => {
    if(val) {
      distritosData = val;
    }
  });
  subdistritos.subscribe(val => {
    if(val) {
      subdistritosData = val;
    }
  })

  export let map: any;
  let geoJsonLayer: any;

  const handleSearch = (option: SearchOption) => {
    filter = "";
    if (geoJsonLayer) {
      map.remove(geoJsonLayer);
    }
    
    let showData;
    switch(option.type) {
      case "distrito":
        const filteredDistritos = distritosData.features.filter(
          feature => feature.properties.FID === option.value
        );
        showData = {
          ...distritosData,
          features: filteredDistritos
        };
        break;
      case "subdistrito":
        const filteredSubdistritos = subdistritosData.features.filter(
          feature => feature.properties.OBJECTID === option.value
        );
        showData = {
          ...distritosData,
          features: filteredSubdistritos
        };
        break;
    }

    const blob = new Blob([JSON.stringify(showData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    geoJsonLayer = new GeoJSONLayer({
      url: url,
    });
    map.add(geoJsonLayer);
  };

  let optionsData: SearchOption[];
  searchOptions.subscribe(val => {
    optionsData = val;
  })

  $: filtered = optionsData.filter(option => option.searchValue.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  $: active = filter.length > 0 && filtered.length !== 0;
</script>

<div class="container">
  <div class="input-container">
    <input bind:value={filter} type="text" class={active ? "active" : ""}>
    <i class="fa-solid fa-magnifying-glass"></i>
  </div>
  {#if active}
  <Options 
    handleSearch={handleSearch} 
    options={filtered} 
  />
  {/if}
</div>

<style lang="scss">
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .input-container {
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
    transition: border-radius 0.4s;
    &.active {
      border-radius: 20px 20px 0 0;
    }
  }
  i {
    position: absolute;
    right: 16px;
    color: var(--gray-400);
    font-size: 18px;
    pointer-events: none;
  }
</style>