/**
 * PARA EDITAR O AGREGAR PROYECTOS:
 * 
 * 1. Agrega las imágenes del proyecto en la carpeta `public/images/`.
 *    Se recomienda usar un formato como `public/images/nombre-proyecto-cover.jpg` para la portada.
 *    Para las galerías, usa un array de rutas de imagen como `["/images/proyecto-1.jpg", "/images/proyecto-2.jpg"]`.
 * 2. Agrega un nuevo objeto `Project` al array `projects` abajo.
 * 3. El mismo proyecto aparecerá automáticamente tanto en la vista "Por Ubicación" como en "Por Tipo"
 *    basado en las etiquetas `location` y `type` que le asignes.
 */

export type ProjectLocation = "quinta-region" | "region-metropolitana" | "argentina";
export type ProjectType = "residencial-casa" | "residencial-departamento" | "oficinas";

export type Project = {
  id: string;
  title: string;
  year: number;
  location: ProjectLocation;
  type: ProjectType;
  description: string;
  cover: string;
  gallery: string[];
};

export const projects: Project[] = [
  {
    id: "casa-renaca",
    title: "Casa Reñaca",
    year: 2023,
    location: "quinta-region",
    type: "residencial-casa",
    description: "Vivienda unifamiliar anclada a la pendiente costera. Hormigón visto y maderas nativas definen su relación con el Océano Pacífico.",
    cover: "/images/casa-renaca-cover.png",
    gallery: [
      "/images/casa-renaca-cover.png",
      "/images/edificio-vina-cover.png",
      "/images/casa-zapallar-cover.png"
    ]
  },
  {
    id: "mirador-concon",
    title: "Edificio Mirador Concón",
    year: 2021,
    location: "quinta-region",
    type: "residencial-departamento",
    description: "Estructura residencial de densidad media. Su grilla de hormigón permite terrazas profundas que enmarcan la bahía.",
    cover: "/images/mirador-concon-cover.png",
    gallery: [
      "/images/mirador-concon-cover.png",
      "/images/casa-mantagua-cover.png",
      "/images/hero.png"
    ]
  },
  {
    id: "oficinas-las-condes",
    title: "Oficinas Las Condes",
    year: 2024,
    location: "region-metropolitana",
    type: "oficinas",
    description: "Edificio corporativo de líneas puras en el centro financiero. Fachada de cristal de alto rendimiento y perfiles de acero oscuro.",
    cover: "/images/oficinas-las-condes-cover.png",
    gallery: [
      "/images/oficinas-las-condes-cover.png",
      "/images/oficinas-providencia-cover.png",
      "/images/hero.png"
    ]
  },
  {
    id: "casa-patagonia",
    title: "Casa Patagonia",
    year: 2020,
    location: "argentina",
    type: "residencial-casa",
    description: "Refugio austral concebido como un monolito oscuro. Su geometría hermética protege contra el clima extremo.",
    cover: "/images/casa-patagonia-cover.png",
    gallery: [
      "/images/casa-patagonia-cover.png",
      "/images/refugio-mendoza-cover.png"
    ]
  },
  {
    id: "edificio-vina",
    title: "Edificio Libertad",
    year: 2018,
    location: "quinta-region",
    type: "residencial-departamento",
    description: "Bloque residencial urbano. La sobriedad del hormigón gris contrasta con la vegetación integrada en sus circulaciones.",
    cover: "/images/edificio-vina-cover.png",
    gallery: [
      "/images/edificio-vina-cover.png",
      "/images/mirador-concon-cover.png"
    ]
  },
  {
    id: "casa-zapallar",
    title: "Casa Zapallar",
    year: 2022,
    location: "quinta-region",
    type: "residencial-casa",
    description: "Pabellón residencial entre pinos costeros. Piedra local y cerramientos acristalados de piso a techo disuelven el límite interior-exterior.",
    cover: "/images/casa-zapallar-cover.png",
    gallery: [
      "/images/casa-zapallar-cover.png",
      "/images/casa-mantagua-cover.png",
      "/images/casa-renaca-cover.png"
    ]
  },
  {
    id: "oficinas-providencia",
    title: "Oficinas Providencia",
    year: 2019,
    location: "region-metropolitana",
    type: "oficinas",
    description: "Rehabilitación de un espacio industrial para uso de oficinas. Hormigón expuesto, instalaciones a la vista y control lumínico preciso.",
    cover: "/images/oficinas-providencia-cover.png",
    gallery: [
      "/images/oficinas-providencia-cover.png",
      "/images/oficinas-las-condes-cover.png"
    ]
  },
  {
    id: "refugio-mendoza",
    title: "Refugio Mendoza",
    year: 2021,
    location: "argentina",
    type: "residencial-casa",
    description: "Estructura de hormigón pigmentado en paisaje semiárido. Un volumen masivo que filtra la intensa luz solar.",
    cover: "/images/refugio-mendoza-cover.png",
    gallery: [
      "/images/refugio-mendoza-cover.png",
      "/images/casa-patagonia-cover.png"
    ]
  },
  {
    id: "casa-mantagua",
    title: "Casa Mantagua",
    year: 2023,
    location: "quinta-region",
    type: "residencial-casa",
    description: "Vivienda horizontal de geometría rigurosa. Un plano de cubierta continuo unifica los espacios habitables sobre el terreno natural.",
    cover: "/images/casa-mantagua-cover.png",
    gallery: [
      "/images/casa-mantagua-cover.png",
      "/images/casa-zapallar-cover.png",
      "/images/casa-renaca-cover.png"
    ]
  }
];