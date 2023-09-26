<script lang="ts">
  import "@arcgis/core/assets/esri/themes/light/main.css";
  import Map from "@arcgis/core/Map";
  import MapView from "@arcgis/core/views/MapView";
  import Header from "./components/Header.svelte";
  import Search from "./components/Search.svelte";
  import InfoSearch from "./components/InfoSearch.svelte";
  import type { Distrito } from "../../interfaces/DistritoJSON";
  import type { Subdistrito } from "../../interfaces/SubdistritoJSON";
  import type { TypeSearch } from "../../interfaces/SearchOption";

  const map = new Map({
    basemap: "gray-vector",
  });

  const createMap = (domNode: string | HTMLDivElement | undefined) => {
    const view = new MapView({
      container: domNode,
      map: map,
      zoom: 13,
      center: [-66.15697627104832, -17.3938997748886],
    });
  };
  // ========== MODAL ==========
  let openModal = false;
  const handleChangeStateModal = () => {
    openModal = !openModal;
  };

  // ========== DATA ==========
  let distritosData: Distrito[];
  let subdistritosData: Subdistrito[];
  let searchBy: TypeSearch;

  const handleLoadSearchBy = (val: TypeSearch) => {
    searchBy = val;
  };

  const handleLoadDistritos = (val: Distrito[]) => {
    distritosData = val;
  };

  const handleLoadSubDistritos = (val: Subdistrito[]) => {
    subdistritosData = val;
  };
</script>

<main>
  <Header>
    <Search
      {map}
      {handleChangeStateModal}
      {handleLoadDistritos}
      {handleLoadSubDistritos}
      {handleLoadSearchBy}
    />
  </Header>
  <div id="map" use:createMap />

  {#if openModal == true}
    <InfoSearch
      handleFun={handleChangeStateModal}
      {subdistritosData}
      {distritosData}
      {searchBy}
    />
  {/if}
</main>

<style>
  main {
    width: 100vw;
    height: 100dvh;
    position: relative;
  }
  #map {
    height: 100%;
    width: 100%;
  }
</style>
