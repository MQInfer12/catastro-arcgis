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
    <div class="close-button" on:click={handleFun}>
      <div>&nbsp;</div>
    </div>
    <div>
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
</div>

<style>
  .modal {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0%;
    z-index: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50%;
  }

  /* Style for the modal content */
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: relative;
    min-width: 100%;
    min-height: 100%;
    display: grid;
    place-content: center;
  }

  /* Style for the close button */
  .close-button {
    position: absolute;
    top: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .close-button div {
    background-color: #7c7c7c;
    width: 50px;
    border-radius: 10px;
    height: 10px;
    
  }
</style>
