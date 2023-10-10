<script lang="ts">
  import Map from "@arcgis/core/Map";
  import {
    comunas,
    distritos,
    educacion,
    salud,
  } from "../../../storage/mapData";
  import type {
    Distrito,
    DistritoJSON,
  } from "../../../interfaces/DistritoJSON";
  import MapView from "@arcgis/core/views/MapView";
  import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
  import type { TypeColor, TypeSearch } from "../../../interfaces/SearchOption";
  import Graphic from "@arcgis/core/Graphic.js";
  import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
  import {
    colorToSymbol,
    createPointSymbol,
  } from "../../../utilities/colorToSymbol";
  import type { Comuna, ComunaJSON } from "../../../interfaces/ComunaJSON";
  import type { Salud, SaludJSON } from "../../../interfaces/SaludJSON";
  import type {
    Educacion,
    EducacionJSON,
  } from "../../../interfaces/EducacionJSON";
  import { subscribeAndAssignData } from "../../../utilities/suscribeAndAssignData";
  import { findFeatureByID } from "../../../utilities/findFeatureOfType";

  export let handleOpen: () => any;
  export let open: boolean;
  export let map: Map;
  export let view: MapView;
  export let handleSearchByTypeVar: (
    type: TypeSearch,
    color: TypeColor
  ) => void;
  export let handleChangeStateModal: (close?: boolean) => void;
  export let handleLoadDistritos: (val: Distrito[]) => void;
  export let handleLoadSalud: (val: Salud[]) => void;
  export let handleLoadEducacion: (val: Educacion[]) => void;
  export let handleLoadComunas: (val: Comuna[]) => void;

  // ===== start - create the variable and asigned the val to the store =====
  let distritosData: DistritoJSON;
  subscribeAndAssignData(distritos, (val: DistritoJSON) => {
    distritosData = val;
  });

  let comunasData: ComunaJSON;
  subscribeAndAssignData(comunas, (val: ComunaJSON) => {
    comunasData = val;
  });

  let saludData: SaludJSON;
  subscribeAndAssignData(salud, (val: SaludJSON) => {
    saludData = val;
  });

  let educacionData: EducacionJSON;
  subscribeAndAssignData(educacion, (val: EducacionJSON) => {
    educacionData = val;
  });
  // ===== end =====

  let geoJsonLayer: GeoJSONLayer;
  let graphicsLayer: GraphicsLayer;

  interface Active {
    type: ActiveType;
    color: TypeColor | null;
  }
  type ActiveType = TypeSearch | null;

  let active: Active = {
    type: null,
    color: null,
  };
  let addedClickEvent = false;

  const clickHandler = (e: any) => {
    view.hitTest(e).then((res) => {
      if (res.results.length > 0 && res.results[0].layer === geoJsonLayer) {
        //@ts-ignore
        const graphic = res.results[0].graphic;
        const geometryType = graphic.geometry.type;
        map.remove(graphicsLayer);
        graphicsLayer = new GraphicsLayer({
          graphics: [
            new Graphic({
              geometry: graphic.geometry,
              symbol:
                geometryType === "point"
                  ? createPointSymbol(active.color as TypeColor, 1, 12)
                  : colorToSymbol(active.color as TypeColor),
              attributes: graphic.attributes,
            }),
          ],
        });
        map.add(graphicsLayer);
        const ObjectId = graphic.attributes.OBJECTID;

        switch (active.type) {
          case "distrito":
            const distritoFID = graphic.attributes.FID;
            const distrito = findFeatureByID(distritosData, distritoFID);
            if (distrito) handleLoadDistritos([distrito]);
            break;
          case "comuna":
            const comuna = findFeatureByID(comunasData, ObjectId);
            if (comuna) handleLoadComunas([comuna]);
            break;
          case "salud":
            const salud = findFeatureByID(saludData, ObjectId);
            if (salud) handleLoadSalud([salud]);
            break;
          case "educacion":
            const educacion = findFeatureByID(educacionData, ObjectId);
            if (educacion) handleLoadEducacion([educacion]);
            break;
        }

        handleSearchByTypeVar(
          active.type as TypeSearch,
          active.color as TypeColor
        );
        handleChangeStateModal();
      }
    });
  };

  interface DataButton {
    text: ActiveType;
    color: TypeColor;
  }

  const handleDistritos = (dataButton: DataButton) => {
    map.removeAll();
    handleChangeStateModal(true);
    active = {
      type: dataButton.text,
      color: dataButton.color,
    };

    const data =
      active.type === "distrito"
        ? distritosData
        : active.type === "comuna"
        ? comunasData
        : active.type === "salud"
        ? saludData
        : educacionData;
    const featureType = data.features[0].geometry.type;

    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    geoJsonLayer = new GeoJSONLayer({
      url: url,
      renderer: {
        //@ts-ignore
        type: "simple",
        symbol:
          featureType === "Point"
            ? createPointSymbol(active.color as TypeColor, 0.4)
            : colorToSymbol(active.color as TypeColor, 0.4),
      },
    });
    map.add(geoJsonLayer);

    geoJsonLayer.when(() => {
      view.goTo({
        target: geoJsonLayer.fullExtent,
        duration: 2000,
        easing: "ease",
      });
    });
    if (!addedClickEvent) {
      view.on("click", (e) => clickHandler(e));
      addedClickEvent = true;
    }
  };

  const dataButtons: DataButton[] = [
    {
      text: "distrito",
      color: "green",
    },
    {
      text: "comuna",
      color: "red",
    },
    {
      text: "salud",
      color: "yellow",
    },
    {
      text: "educacion",
      color: "purple",
    },
  ];

  $: active.type = open ? active.type : null;
</script>

<div class="container" style={`width: ${open ? "100%" : "auto"}`}>
  <button class="icon-button" on:click={handleOpen}>
    {#if open}
      <i class="fa-solid fa-xmark" />
    {:else}
      <i class="fa-solid fa-eye" />
    {/if}
  </button>
  {#if open}
    <div class="buttons">
      {#each dataButtons as button}
        <button
          on:click={() => handleDistritos(button)}
          class="view-button"
          style={`background-color: var(--${button.color}-1); opacity: ${
            active.type === button.text ? "1" : "0.6"
          };`}>{button.text}</button
        >
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .container {
    position: relative;
    overflow: hidden;
    border-radius: 20px 0 0 20px;
    min-width: 40px;
  }
  .icon-button {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background-color: var(--white);
    border: 1px solid var(--gray-200);
    position: relative;
    z-index: 1;
    & > i {
      color: var(--gray-400);
      font-size: 16px;
      animation: appearIcon 0.3s;
      @keyframes appearIcon {
        from {
          transform: rotate(-360deg);
        }
        to {
          opacity: rotate(0);
        }
      }
    }
  }
  .buttons {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    animation: fromLeft 0.3s;
    padding-left: 48px;
    display: flex;
    gap: 8px;

    @keyframes fromLeft {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
  }
  .view-button {
    height: 100%;
    padding: 0 16px;
    border-radius: 20px;
    border: none;
    color: var(--white);
    transition: all 0.3s;
    text-transform: capitalize;
  }
</style>
