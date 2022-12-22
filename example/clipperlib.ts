import clipper2 from "clipper2";

const module = await clipper2();


export const {
  PathsD,
  Paths64,
  makePathD,
  makePath,
  union,
  intersect,
  xor,
  inflatePaths,
  FillRule,
} = module;
