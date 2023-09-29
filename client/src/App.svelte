<script lang="ts">
  import { Route, Router } from 'svelte-routing'
  import Home from './pages/home/Index.svelte';
  import { onMount } from 'svelte';
  import type { DistritoJSON } from './interfaces/DistritoJSON';
  import type { SubdistritoJSON } from './interfaces/SubdistritoJSON';
  import { distritos, subdistritos } from './storage/mapData';
  import { searchOptions } from './storage/searchOptions';
  import type { SearchOption } from './interfaces/SearchOption';
  import dataDistritosJSON from './data/distritos.json';
  import dataSubdistritosJSON from './data/subdistritos.json';

  export let url = "";

  onMount(async () => {
    const urlDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/1/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlSubDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/3/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;

    const dataDistritos: DistritoJSON = dataDistritosJSON;
    const dataSubdistritos: SubdistritoJSON = dataSubdistritosJSON;
    /* const dataDistritos: DistritoJSON = await fetch(urlDistritos).then((res) => res.json()); */
    distritos.set(dataDistritos);

    /* const dataSubdistritos: SubdistritoJSON = await fetch(urlSubDistritos).then((res) => res.json()); */
    subdistritos.set(dataSubdistritos);
    const subdistritosNumReg = /SubDistrito: \d+/g;
    const subdistritosZonaReg = /Zona: [^\n]+/g;

    searchOptions.set([
      ...dataDistritos.features.map(feature => ({
        data: {
          color: "green",
          text: feature.properties.comuna,
          little: feature.properties.Nombre,
        },
        type: "distrito",
        value: feature.properties.FID,
        searchValue: feature.properties.Nombre + " " + feature.properties.comuna
      })),
      ...dataSubdistritos.features.map(feature => ({
        data: {
          color: "blue",
          text: feature.properties.Nombre.match(subdistritosZonaReg),
          little: feature.properties.Nombre.match(subdistritosNumReg)
        },
        type: "subdistrito",
        value: feature.properties.OBJECTID,
        searchValue: feature.properties.Nombre
      }))
    ] as SearchOption[]);
  });
</script>

<Router {url}>
  <Route path="/" component={Home} />
</Router>