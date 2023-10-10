export interface EducacionJSON {
  type: string
  crs: Crs
  features: Educacion[]
}

export interface Crs {
  type: string
  properties: Properties
}

export interface Properties {
  name: string
}

export interface Educacion {
  type: string
  id: number
  geometry: Geometry
  properties: Properties2
}

export interface Geometry {
  type: string
  coordinates: number[]
}

export interface Properties2 {
  OBJECTID: number
  CICLOS: string
  NOMBRE: string
  DEPENDENCI: string
}
