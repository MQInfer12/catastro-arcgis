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
    SearchOption,
    TypeSearch,
  } from "../../../interfaces/SearchOption";
  import { searchOptions } from "../../../storage/searchOptions";
  import MapView from "@arcgis/core/views/MapView";
  import Map from "@arcgis/core/Map";
  import { colorToSymbol, createPointSymbol } from "../../../utilities/colorToSymbol";
  import type { Comuna, ComunaJSON } from "../../../interfaces/ComunaJSON";
  import type { Salud, SaludJSON } from "../../../interfaces/SaludJSON";
    import type { Educacion, EducacionJSON } from "../../../interfaces/EducacionJSON";

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

  const handleSearch = (option: SearchOption) => {
    handleLoadSearchBy(option);

    filter = "";
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

  $: filtered = optionsData.filter((option) =>
    option.searchValue.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  );
  $: active = filter.length > 0 && filtered.length !== 0;
</script>

<div class="container">
  <div class="input-container">
    <input bind:value={filter} placeholder="Buscar" type="text" class={active ? "active" : ""} />
    <i class="fa-solid fa-magnifying-glass" />
  </div>
  <Options {active} {handleSearch} options={filtered} />
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
  i {
    position: absolute;
    right: 16px;
    color: var(--gray-400);
    font-size: 18px;
    pointer-events: none;
  }
</style>
