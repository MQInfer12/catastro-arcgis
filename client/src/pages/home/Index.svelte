<script lang="ts">
  import "@arcgis/core/assets/esri/themes/light/main.css";
  import Map from "@arcgis/core/Map";
  import MapView from "@arcgis/core/views/MapView";
    import Header from "./components/Header.svelte";

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
</script>

<main>
  <Header />
  <div id="map" use:createMap />
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