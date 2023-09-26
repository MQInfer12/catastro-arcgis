<script lang="ts">
  import { Route, Router } from 'svelte-routing'
  import Home from './pages/home/Index.svelte';
  import { onMount } from 'svelte';
  import type { DistritoJSON } from './interfaces/DistritoJSON';
  import type { SubdistritoJSON } from './interfaces/SubdistritoJSON';
  import { distritos, subdistritos } from './storage/mapData';
    import { searchOptions } from './storage/searchOptions';
    import type { SearchOption } from './interfaces/SearchOption';

  export let url = "";

  onMount(async () => {
    const urlDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/1/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlSubDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/3/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;

    const dataDistritos: DistritoJSON = await fetch(urlDistritos).then((res) => res.json());
    distritos.set(dataDistritos);

    const dataSubdistritos: SubdistritoJSON = await fetch(urlSubDistritos).then((res) => res.json());
    subdistritos.set(dataSubdistritos);

    searchOptions.set([
      ...dataDistritos.features.map(feature => ({
        data: {
          color: "red",
          text: feature.properties.comuna,
          little: feature.properties.Nombre,
        },
        type: "distrito",
        value: feature.properties.FID,
        searchValue: feature.properties.Nombre + " " + feature.properties.comuna
      }))
    ] as SearchOption[]);
  });
</script>

<Router {url}>
  <Route path="/" component={Home} />
</Router>