<script lang="ts">
  import type { SearchOption } from "../../../interfaces/SearchOption";

  export var data: any;
  export var searchBy: SearchOption;
</script>

<h2 style={`color: var(--${searchBy.data.color}-2);`}>Detalles de tu busqueda</h2>
<table>
  <thead>
    <tr>
      <th 
      class="th-title"
      style={`background-color: var(--${searchBy.data.color}-1); border: 1px solid var(--${searchBy.data.color}-2);`}
        colspan="2"
      >{searchBy.type}</th>
    </tr>
  </thead>
  <tbody>
    {#each Object.keys(data) as key, i}
      {#if !(key === "FID" || key === "OBJECTID")}
        <tr>
          <th 
            class="th-table"
            style={`background-color: var(--${searchBy.data.color}-1); border: 1px solid var(--${searchBy.data.color}-2);`}
          >
            {#if key === "Shape_Area"}
              Área
            {:else if key === "Shape_Length" || key === "Shape_Leng"}
              Perímetro
            {:else}
              {key}
            {/if}
          </th>
          <td
            style={`border: 1px solid var(--${searchBy.data.color}-2);`}
          >{data[key]}</td>
        </tr>
      {/if}
    {/each}
  </tbody>
</table>

<style lang="scss">
  h2 {
    margin-bottom: 16px;
  }
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }
  th {
    color: var(--white);
    padding: 2px 8px;
    text-transform: capitalize;
    text-align: start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  td {
    background-color: var(--white);
    color: var(--gray-800);
    padding: 2px 8px;
    text-align: start;
  }
  .th-title {
    text-align: center;
  }
</style>