<script lang="ts">
  import IconButton from "./components/IconButton.svelte";

  import "@arcgis/core/assets/esri/themes/light/main.css";
  import Map from "@arcgis/core/Map";
  import MapView from "@arcgis/core/views/MapView";
  import Header from "./components/Header.svelte";
  import Search from "./components/Search.svelte";
  import InfoSearch from "./components/InfoSearch.svelte";
  import type { Distrito } from "../../interfaces/DistritoJSON";
  import type { Subdistrito } from "../../interfaces/SubdistritoJSON";
  import type { SearchOption, TypeSearch } from "../../interfaces/SearchOption";
  import BottomNav from "./components/BottomNav.svelte";
  import Layers from "./components/Layers.svelte";
  import Views from "./components/Views.svelte";

  const map = new Map({
    basemap: "gray-vector",
  });
  let view: MapView;

  const createMap = (domNode: string | HTMLDivElement | undefined) => {
    view = new MapView({
      container: domNode,
      map: map,
      zoom: 13,
      center: [-66.15697627104832, -17.3938997748886],
    });
  };
  // ========== MODAL ==========
  let openModal = false;
  const handleChangeStateModal = (close = false) => {
    if (!openModal) openModal = !openModal;
    if (openModal) openModal = true;
    if (close) openModal = false;
  };

  // ========== DATA ==========
  let distritosData: Distrito[];
  let subdistritosData: Subdistrito[];
  let searchBy: SearchOption;
  let searchByTypeVar: TypeSearch;
  let distritosDataClick: Distrito;

  const handleSearchByTypeVar = (val: TypeSearch) => {
    searchByTypeVar = val;
  };

  const handleloadDistrisoDataClick = (val: Distrito) => {
    distritosDataClick = val;
  };

  const handleLoadSearchBy = (val: SearchOption) => {
    searchBy = val;
  };

  const handleLoadDistritos = (val: Distrito[]) => {
    distritosData = val;
  };

  const handleLoadSubDistritos = (val: Subdistrito[]) => {
    subdistritosData = val;
  };

  let openViews = false;
  const handleOpenViews = () => {
    map.removeAll();
    openViews = !openViews;
  };
</script>

<main>
  <Header>
    <div class="controls">
      <Views
        open={openViews}
        handleOpen={handleOpenViews}
        {map}
        {view}
        {handleloadDistrisoDataClick}
        {handleSearchByTypeVar}
        {handleChangeStateModal}
      />
      {#if !openViews}
        <Search
          {view}
          {map}
          {handleChangeStateModal}
          {handleLoadDistritos}
          {handleLoadSubDistritos}
          {handleLoadSearchBy}
          {handleSearchByTypeVar}
        />
        <Layers {map} />
      {/if}
    </div>
  </Header>
  <div id="map" use:createMap />
  <BottomNav />
  {#if openModal == true}
    <InfoSearch
      handleFun={handleChangeStateModal}
      {subdistritosData}
      {distritosData}
      {searchBy}
      {distritosDataClick}
      {searchByTypeVar}
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
  .controls {
    width: 100%;
    display: flex;
    gap: 8px;
  }
</style>
