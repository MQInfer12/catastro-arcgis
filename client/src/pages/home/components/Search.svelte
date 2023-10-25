<script lang="ts">
  import type {
    Distrito,
    DistritoJSON,
  } from "../../../interfaces/DistritoJSON";
  import { comunas, distritos, educacion, salud, subdistritos } from "../../../storage/mapData";
  import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
  import Options from "./Options.svelte";
  import type {
    Subdistrito,
    SubdistritoJSON,
  } from "../../../interfaces/SubdistritoJSON";
  import type {
    SearchOption, TypeCoords,
  } from "../../../interfaces/SearchOption";
  import { searchOptions } from "../../../storage/searchOptions";
  import MapView from "@arcgis/core/views/MapView";
  import Map from "@arcgis/core/Map";
  import { colorToSymbol, createPointSymbol } from "../../../utilities/colorToSymbol";
  import type { Comuna, ComunaJSON } from "../../../interfaces/ComunaJSON";
  import type { Salud, SaludJSON } from "../../../interfaces/SaludJSON";
  import type { Educacion, EducacionJSON } from "../../../interfaces/EducacionJSON";
  import { distanceBetweenCoords } from "../../../utilities/distanceBeetweenCoords";
  import Circle from '@arcgis/core/geometry/Circle';
  import Graphic from "@arcgis/core/Graphic";
  import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
    import { afterUpdate, beforeUpdate } from "svelte";

  // ======== PARAMS ========
  export let handleChangeStateModal: () => void;
  export let handleLoadDistritos: (val: Distrito[]) => void;
  export let handleLoadSubDistritos: (val: Subdistrito[]) => void;
  export let handleLoadComunas: (val: Comuna[]) => void;
  export let handleLoadSalud: (val: Salud[]) => void;
  export let handleLoadEducacion: (val: Educacion[]) => void;
  export let handleLoadSearchBy: (val: SearchOption) => void;

  let filter = "";

  let distritosData: DistritoJSON;
  let subdistritosData: SubdistritoJSON;
  let comunasData: ComunaJSON;
  let saludData: SaludJSON;
  let educacionData: EducacionJSON;

  distritos.subscribe((val) => {
    if (val) {
      distritosData = val;
    }
  });
  subdistritos.subscribe((val) => {
    if (val) {
      subdistritosData = val;
    }
  });
  comunas.subscribe((val) => {
    if (val) {
      comunasData = val;
    }
  });
  salud.subscribe((val) => {
    if(val) {
      saludData = val;
    }
  });
  educacion.subscribe((val) => {
    if(val) {
      educacionData = val;
    }
  });

  export let map: Map;
  export let view: MapView;
  let geoJsonLayer: GeoJSONLayer;

  const coordRegex = /-[0-9]*\.[0-9]+, -[0-9]*\.[0-9]+/i;

  const handleSearch = (option: SearchOption) => {
    handleLoadSearchBy(option);

    if(!filter.match(coordRegex)) {
      filter = "";
    }
    if (geoJsonLayer) {
      map.remove(geoJsonLayer);
    }

    let showData;
    let featureType;
    switch (option.type) {
      case "distrito":
        const filteredDistritos = distritosData.features.filter(
          (feature) => feature.properties.FID === option.value
        );
        showData = {
          ...distritosData,
          features: filteredDistritos,
        };
        handleLoadDistritos(filteredDistritos);
        break;
      case "subdistrito":
        const filteredSubdistritos = subdistritosData.features.filter(
          (feature) => feature.properties.OBJECTID === option.value
        );
        /* showData = {
          ...distritosData,
          features: filteredSubdistritos,
        }; */
        handleLoadSubDistritos(filteredSubdistritos);
        break;
      case "comuna":
        const filteredComunas = comunasData.features.filter(
          (feature) => feature.properties.OBJECTID === option.value
        );
        showData = {
          ...comunasData,
          features: filteredComunas,
        };
        handleLoadComunas(filteredComunas);
        break;
      case "salud":
        const filteredSalud = saludData.features.filter(
          (feature) => feature.properties.OBJECTID === option.value
        );
        featureType = saludData.features[0].geometry.type;
        showData = {
          ...saludData,
          features: filteredSalud,
        };
        handleLoadSalud(filteredSalud);
        break;
      case "educacion": 
        const filteredEducacion = educacionData.features.filter(
          (feature) => feature.properties.OBJECTID === option.value
        );
        featureType = educacionData.features[0].geometry.type;
        showData = {
          ...educacionData,
          features: filteredEducacion,
        };
        handleLoadEducacion(filteredEducacion);
        break;
    }

    const blob = new Blob([JSON.stringify(showData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    geoJsonLayer = new GeoJSONLayer({
      url: url,
      renderer: {
        //@ts-ignore
        type: "simple",
        symbol: featureType === "Point" ? createPointSymbol(option.data.color, 1, 12) : colorToSymbol(option.data.color, 0.4)
      }
    });
    map.add(geoJsonLayer);

    geoJsonLayer.when(() => {
      view.goTo({
        target: geoJsonLayer.fullExtent,
        duration: 2000,
        easing: "ease",
      });
    });

    handleChangeStateModal();
  };

  let optionsData: SearchOption[];
  searchOptions.subscribe((val) => {
    optionsData = val;
  });

  const inDistance = 300;

  let circleLayer = new GraphicsLayer();
  let circleGraphic: Graphic;

  //show a circle around the coordinates
  afterUpdate(() => {
    map.remove(circleLayer);
    if(filter.match(coordRegex)) {
      const coords: TypeCoords = filter.split(",").map(val => Number(val)) as TypeCoords;
      const reversedCoords: TypeCoords = coords.toReversed() as TypeCoords;
      circleLayer.remove(circleGraphic);
      circleGraphic = new Graphic({
        geometry: new Circle({
          center: reversedCoords as any,
          radius: inDistance * 2
        }),
        symbol: colorToSymbol("green", 0.3)
      });
      circleLayer.add(circleGraphic);
      map.add(circleLayer);
      circleLayer.when(() => {
        view.goTo({
          target: reversedCoords,
          duration: 2000,
          easing: "ease",
        });
      });
    }
  });

  $: filtered = optionsData.filter((option) => {
    if(filter.match(coordRegex)) {
      if(option.coords) {
        const coords: TypeCoords = filter.split(",").map(val => Number(val)) as TypeCoords;
        const reversedCoords: TypeCoords = coords.toReversed() as TypeCoords;
        const distance = distanceBetweenCoords(option.coords, reversedCoords);
        return distance < inDistance / 1000;
      } else {
        return false;
      }
    }
    return option.searchValue.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  });
  $: active = filter.length > 0 && filtered.length !== 0;
</script>

<div class="container">
  <div class="input-container">
    <input bind:value={filter} placeholder="Buscar" type="text" class={active ? "active" : ""} />
    {#if filter}
    <button class="fa-solid fa-xmark" on:click={() => filter = ""} />
    {:else}
    <i class="fa-solid fa-magnifying-glass" />
    {/if}
  </div>
  <Options 
    {active} 
    {handleSearch} 
    options={filtered} 
  />
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
    &::placeholder {
      color: var(--gray-200);
    }
  }
  i, button {
    position: absolute;
    right: 16px;
    color: var(--gray-400);
    font-size: 18px;
    pointer-events: none;
    background-color: transparent;
    border: none;
  }
  button {
    pointer-events: all;
    right: 20px;
  }
</style>
