<script lang="ts">
  import { Route, Router } from 'svelte-routing'
  import Home from './pages/home/Index.svelte';
  import { onMount } from 'svelte';
  import type { DistritoJSON } from './interfaces/DistritoJSON';
  import type { SubdistritoJSON } from './interfaces/SubdistritoJSON';
  import { comunas, distritos, subdistritos } from './storage/mapData';
  import { searchOptions } from './storage/searchOptions';
  import type { SearchOption } from './interfaces/SearchOption';
  import dataDistritosJSON from './data/distritos.json';
  import dataSubdistritosJSON from './data/subdistritos.json';
  import dataComunasJSON from './data/comunas.json';
  import type { ComunaJSON } from './interfaces/ComunaJSON';

  export let url = "";

  onMount(async () => {
    const urlDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/1/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlSubDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/3/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlComunas = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/2/query?where=Comuna+LIKE+%27%25%27&outFields=*&f=geojson`;

    const dataDistritos: DistritoJSON = dataDistritosJSON;
    const dataSubdistritos: SubdistritoJSON = dataSubdistritosJSON;
    const dataComunas: ComunaJSON = dataComunasJSON;
    /* const dataDistritos: DistritoJSON = await fetch(urlDistritos).then((res) => res.json()); */
    distritos.set(dataDistritos);

    /* const dataSubdistritos: SubdistritoJSON = await fetch(urlSubDistritos).then((res) => res.json()); */
    subdistritos.set(dataSubdistritos);
    comunas.set(dataComunas);

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
      })),
      ...dataComunas.features.map(feature => ({
        data: {
          color: "red",
          text: feature.properties.Comuna,
          little: "Comuna " + feature.properties.OBJECTID 
        },
        type: "comuna",
        value: feature.properties.OBJECTID,
        searchValue: feature.properties.Comuna + " " + feature.properties.OBJECTID
      }))
    ] as SearchOption[]);
  });
</script>

<Router {url}>
  <Route path="/" component={Home} />
</Router>