export function findFeatureByID(data: any, id: any) {
    return data.features.find(
      (feature: any) => feature.properties.OBJECTID === id
    );
  }