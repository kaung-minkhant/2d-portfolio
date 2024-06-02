export interface ObjectType {
  height: number;
  id: number;
  name: string;
  rotation: number;
  type: string;
  point?: boolean;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface TileLayer {
  data: number[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  type: "tilelayer";
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface ObjectLayer {
  draworder: string;
  id: number;
  name: string;
  objects: ObjectType[];
  opacity: number;
  type: "objectgroup";
  visible: boolean;
  x: number;
  y: number;
}

export interface MapType {
  compressionlevel: number;
  height: number;
  infinite: false;
  layers: (TileLayer | ObjectLayer)[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: 'orthogonal';
  renderorder: 'right-down';
  tiledversion: string;
  tileheight: number;
  tilewidth: number,
  type: 'map',
  version: string,
  width: number
}
