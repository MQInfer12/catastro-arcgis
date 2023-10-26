<script lang="ts">
  import { Route, Router } from 'svelte-routing'
  import Home from './pages/home/Index.svelte';
  import { onMount } from 'svelte';
  import type { DistritoJSON } from './interfaces/DistritoJSON';
  import type { SubdistritoJSON } from './interfaces/SubdistritoJSON';
  import { comunas, distritos, educacion, salud, subdistritos } from './storage/mapData';
  import { searchOptions } from './storage/searchOptions';
  import type { SearchOption } from './interfaces/SearchOption';
  import dataDistritosJSON from './data/distritos.json';
  import dataSubdistritosJSON from './data/subdistritos.json';
  import dataComunasJSON from './data/comunas.json';
  import dataSaludJSON from './data/salud.json';
  import dataEducacionJSON from './data/educacion.json';
  import type { ComunaJSON } from './interfaces/ComunaJSON';
  import type { SaludJSON } from './interfaces/SaludJSON';
  import type { EducacionJSON } from './interfaces/EducacionJSON';
  import { centroid, polygon } from '@turf/turf'
    

  export let url = "";

  onMount(async () => {
    const urlDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/1/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlSubDistritos = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/3/query?where=Nombre+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlComunas = `http://192.168.105.219:6080/arcgis/rest/services/planificacion/limites/MapServer/2/query?where=Comuna+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlSalud = `http://192.168.105.219:6080/arcgis/rest/services/centros/centros/MapServer/0/query?where=NOMBRE+LIKE+%27%25%27&outFields=*&f=geojson`;
    const urlEducacion = `http://192.168.105.219:6080/arcgis/rest/services/centros/centros/MapServer/2/query?where=NOMBRE+LIKE+%27%25%27&outFields=*&f=geojson`;

    const dataDistritos: DistritoJSON = dataDistritosJSON;
    const dataSubdistritos: SubdistritoJSON = dataSubdistritosJSON;
    const dataComunas: ComunaJSON = dataComunasJSON;
    const dataSalud: SaludJSON = dataSaludJSON;
    const dataEducacion: EducacionJSON = dataEducacionJSON;
    /* const dataDistritos: DistritoJSON = await fetch(urlDistritos).then((res) => res.json()); */
    distritos.set(dataDistritos);

    /* const dataSubdistritos: SubdistritoJSON = await fetch(urlSubDistritos).then((res) => res.json()); */
    subdistritos.set(dataSubdistritos);
    comunas.set(dataComunas);
    salud.set(dataSalud);
    educacion.set(dataEducacion);

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
        searchValue: feature.properties.Nombre + " " + feature.properties.comuna,
        coords: centroid(polygon(feature.geometry.coordinates)).geometry.coordinates
      })),
      ...dataSubdistritos.features.map(feature => ({
        data: {
          color: "blue",
          text: feature.properties.Nombre.match(subdistritosZonaReg),
          little: feature.properties.Nombre.match(subdistritosNumReg)
        },
        type: "subdistrito",
        value: feature.properties.OBJECTID,
        searchValue: feature.properties.Nombre,
        coords: null
      })),
      ...dataComunas.features.map(feature => ({
        data: {
          color: "red",
          text: feature.properties.Comuna,
          little: "Comuna " + feature.properties.OBJECTID 
        },
        type: "comuna",
        value: feature.properties.OBJECTID,
        searchValue: feature.properties.Comuna + " " + feature.properties.OBJECTID,
        coords: centroid(polygon(feature.geometry.coordinates)).geometry.coordinates
      })),
      ...dataSalud.features.map(feature => ({
        data: {
          color: "yellow",
          text: feature.properties.NOMBRE,
          little: feature.properties.TIPO
        },
        type: "salud",
        value: feature.properties.OBJECTID,
        searchValue: "salud " + feature.properties.TIPO + " " + feature.properties.NOMBRE,
        coords: feature.geometry.coordinates
      })),
      ...dataEducacion.features.map(feature => ({
        data: {
          color: "purple",
          text: feature.properties.NOMBRE,
          little: "Unidad educativa " + feature.properties.DEPENDENCI.toLocaleLowerCase()
        },
        type: "educacion",
        value: feature.properties.OBJECTID,
        searchValue: "Unidad educativa " + feature.properties.DEPENDENCI + " " + feature.properties.NOMBRE,
        coords: feature.geometry.coordinates
      }))
    ] as SearchOption[]);
  });
</script>

<Router {url}>
  <Route path="/" component={Home} />
</Router>