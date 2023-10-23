<script lang="ts">
  import "@arcgis/core/assets/esri/themes/light/main.css";
  import Map from "@arcgis/core/Map";
  import MapView from "@arcgis/core/views/MapView";
  import Header from "./components/Header.svelte";
  import Search from "./components/Search.svelte";
  import InfoSearch from "./components/InfoSearch.svelte";
  import type { Distrito } from "../../interfaces/DistritoJSON";
  import type { Subdistrito } from "../../interfaces/SubdistritoJSON";
  import type {
    SearchOption,
    TypeColor,
    TypeSearch,
  } from "../../interfaces/SearchOption";
  import BottomNav from "./components/BottomNav.svelte";
  import Layers from "./components/Layers.svelte";
  import Views from "./components/Views.svelte";
  import type { Comuna } from "../../interfaces/ComunaJSON";
  import BtnShowModal from "./components/btnShowModal.svelte";
    import type { Salud } from "../../interfaces/SaludJSON";
    import type { Educacion } from "../../interfaces/EducacionJSON";

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
  let ShowbtnOpenModal = false;
  const handleChangeStateModal = (close = false) => {
    ShowbtnOpenModal = true;
    if (!openModal) openModal = !openModal;
    if (openModal) openModal = true;
    if (close) openModal = false;
  };

  // ========== DATA ==========
  let distritosData: Distrito[];
  let subdistritosData: Subdistrito[];
  let comunasData: Comuna[];
  let saludData: Salud[];
  let educacionData: Educacion[];

  //load by default the search
  let searchBy: SearchOption = {
    data: {
      color: "green",
      little: "",
      text: "",
    },
    searchValue: "",
    type: "distrito",
    value: "",
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

  const handleLoadComunas = (val: Comuna[]) => {
    comunasData = val;
  };

  const handleLoadSalud = (val: Salud[]) => {
    saludData = val;
  };

  const handleLoadEducacion = (val: Educacion[]) => {
    educacionData = val;
  }

  const handleSearchByTypeVar = (type: TypeSearch, color: TypeColor) => {
    searchBy.type = type;
    searchBy.data.color = color;
  };

  let openViews = false;
  const handleOpenViews = () => {
    map.removeAll();
    openViews = !openViews;
    handleChangeStateModal(true);
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
        {handleChangeStateModal}
        {handleLoadDistritos}
        {handleLoadComunas}
        {handleLoadSalud}
        {handleLoadEducacion}
        {handleSearchByTypeVar}
      />
      {#if !openViews}
        <Search
          {view}
          {map}
          {handleChangeStateModal}
          {handleLoadDistritos}
          {handleLoadSubDistritos}
          {handleLoadComunas}
          {handleLoadSalud}
          {handleLoadEducacion}
          {handleLoadSearchBy}
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
      {comunasData}
      {saludData}
      {educacionData}
      {searchBy}
    />
  {/if}
  {#if openModal == false && ShowbtnOpenModal == true}
    <BtnShowModal searchBy={searchBy} {handleChangeStateModal} />
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
