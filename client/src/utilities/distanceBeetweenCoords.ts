import type { TypeCoords } from "../interfaces/SearchOption";

export const distanceBetweenCoords = (point1: TypeCoords, point2: TypeCoords) => {
  const distance = calcCrow(...point1, ...point2);
  return distance;
}

function calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value: number) 
{
    return Value * Math.PI / 180;
}
