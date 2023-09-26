<script lang="ts">
  import type { Distrito } from "../../../interfaces/DistritoJSON";
  import type { TypeSearch } from "../../../interfaces/SearchOption";
  import type { Subdistrito } from "../../../interfaces/SubdistritoJSON";
  import { distritos, subdistritos } from "../../../storage/mapData";

  // ======== PARAMS ========
  export let handleFun: () => void;
  export let distritosData: Distrito[];
  export let subdistritosData: Subdistrito[];
  export let searchBy: TypeSearch;
</script>

<div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close-button" on:click={handleFun}>&times;</span>
    <h2>Datos de tu busqueda</h2>
    {#if searchBy == "distrito"}
      <div>
        <p>FID: {distritosData[0].properties.FID}</p>
        <p>Nombre: {distritosData[0].properties.Nombre}</p>
        <p>Distrito: {distritosData[0].properties.distrito}</p>
        <p>Comuna: {distritosData[0].properties.comuna}</p>
        <p>Área: {distritosData[0].properties.Shape_Area}</p>
      </div>
    {/if}

    {#if searchBy == "subdistrito"}
      <div>
        <p><b>Nombre:</b> {subdistritosData[0].properties.Nombre}</p>
        <p><b>ObjectId:</b> {subdistritosData[0].properties.OBJECTID}</p>
        <p><b>Longitud:</b> {subdistritosData[0].properties.Shape_Length}</p>
        <p><b>Área:</b> {subdistritosData[0].properties.Shape_Area}</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .modal {
    display: grid;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
    justify-content: center;
    align-items: center;
  }

  /* Style for the modal content */
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: relative;
    width: 400px;
  }

  /* Style for the close button */
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
</style>
