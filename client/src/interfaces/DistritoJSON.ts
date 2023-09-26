export interface DistritoJSON {
  type: string
  crs: Crs
  features: Distrito[]
}

export interface Crs {
  type: string
  properties: Properties
}

export interface Properties {
  name: string
}

export interface Distrito {
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
  distrito: number
  comuna: string
  Nombre: string
  Shape_Area: number
  FID: number
  OBJECTID: number
  Shape_Leng: number
}