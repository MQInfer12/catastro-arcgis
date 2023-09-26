export interface SubdistritoJSON {
  type: string
  crs: Crs
  features: Subdistrito[]
}

export interface Crs {
  type: string
  properties: Properties
}

export interface Properties {
  name: string
}

export interface Subdistrito {
  type: string
  id: number
  geometry: any
  properties: Properties2
}

export interface Properties2 {
  OBJECTID: number
  Nombre: string
  Shape_Length: number
  Shape_Area: number
}
