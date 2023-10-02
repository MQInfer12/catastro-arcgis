export interface ComunaJSON {
  type: string
  crs: Crs
  features: Comuna[]
}

export interface Crs {
  type: string
  properties: Properties
}

export interface Properties {
  name: string
}

export interface Comuna {
  type: string
  id: number
  geometry: Geometry
  properties: Properties2
}

export interface Geometry {
  type: string
  coordinates: number[][][]
}

export interface Properties2 {
  OBJECTID: number
  Comuna: string
  Hectares: number
  Shape_Length: number
  Shape_Area: number
}
