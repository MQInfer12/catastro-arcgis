export interface SaludJSON {
  type: string
  crs: Crs
  features: Salud[]
}

export interface Crs {
  type: string
  properties: Properties
}

export interface Properties {
  name: string
}

export interface Salud {
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
  NOMBRE: string
  TIPO: string
  SUB_SECTOR: string
  NIVEL: string
  TIPO_ESTAB: string
  Prueba: string
}
