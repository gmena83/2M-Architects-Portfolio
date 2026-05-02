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

// Notas para el estudio:
// - Las fotos provienen del archivo "2mArq" entregado por el estudio.
// - Los `year`, `location` y descripciones marcadas con TODO requieren confirmación
//   del estudio: cuando los confirmen, basta con editar el campo y borrar el TODO.
// - Si más adelante se quieren separar "comerciales" e "institucionales" del tipo
//   `oficinas`, hay que ampliar `ProjectType` y los filtros en `home.tsx`.

export const projects: Project[] = [
  // === Edificios residenciales ===
  {
    id: "edificio-bella-brizza",
    title: "Edificio Bella Brizza",
    year: 2024, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento",
    description:
      "Edificio residencial de volumen contenido y fachada articulada en bandas horizontales. Las terrazas continuas amplían cada departamento hacia el exterior.",
    cover: "/images/edificio-bella-brizza-cover.jpg",
    gallery: [
      "/images/edificio-bella-brizza-cover.jpg",
      "/images/edificio-bella-brizza-2.jpg",
      "/images/edificio-bella-brizza-3.jpg",
    ],
  },
  {
    id: "edificio-melinka",
    title: "Edificio Melinka",
    year: 2023, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento",
    description:
      "Bloque residencial de geometría rotunda. Su fachada blanca y los retranqueos en planta alta otorgan al volumen una presencia serena dentro del tejido urbano.",
    cover: "/images/edificio-melinka-cover.jpg",
    gallery: [
      "/images/edificio-melinka-cover.jpg",
      "/images/edificio-melinka-2.jpg",
      "/images/edificio-melinka-3.jpg",
      "/images/edificio-melinka-4.jpg",
    ],
  },
  {
    id: "edificio-foresta",
    title: "Edificio Foresta",
    year: 2023, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento",
    description:
      "Edificio de mediana altura integrado a un entorno arbolado. La envolvente combina paños macizos y vidrios para enmarcar las vistas hacia el verde circundante.",
    cover: "/images/edificio-foresta-cover.jpg",
    gallery: [
      "/images/edificio-foresta-cover.jpg",
      "/images/edificio-foresta-2.jpg",
      "/images/edificio-foresta-3.jpg",
    ],
  },
  {
    id: "edificio-lautaro",
    title: "Edificio Lautaro",
    year: 2022, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento",
    description:
      "Proyecto residencial urbano de líneas sobrias. La fachada se ordena en una grilla rigurosa que permite balcones profundos en cada nivel.",
    cover: "/images/edificio-lautaro-cover.jpg",
    gallery: [
      "/images/edificio-lautaro-cover.jpg",
      "/images/edificio-lautaro-2.jpg",
      "/images/edificio-lautaro-3.jpg",
    ],
  },
  {
    id: "edificio-parque",
    title: "Edificio Parque",
    year: 2022, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento",
    description:
      "Volumen residencial pensado para abrirse a un parque adyacente. Las terrazas escalonadas asoman entre la vegetación y filtran el sol durante el día.",
    cover: "/images/edificio-parque-cover.jpg",
    gallery: [
      "/images/edificio-parque-cover.jpg",
      "/images/edificio-parque-2.jpg",
    ],
  },
  {
    id: "edificio-alessandri",
    title: "Edificio Alessandri",
    year: 2021, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento",
    description:
      "Edificio residencial de carácter urbano. Su composición de planos blancos y aberturas regulares resuelve la fachada con sobriedad y claridad geométrica.",
    cover: "/images/edificio-alessandri-cover.jpg",
    gallery: [
      "/images/edificio-alessandri-cover.jpg",
      "/images/edificio-alessandri-2.jpg",
    ],
  },
  {
    id: "edificio-montemar",
    title: "Edificio Montemar",
    year: 2021,
    location: "quinta-region",
    type: "residencial-departamento",
    description:
      "Edificio residencial en el sector costero de Montemar. La masa se asienta sobre un zócalo continuo y libera sus niveles superiores hacia el horizonte marino.",
    cover: "/images/edificio-montemar-cover.jpg",
    gallery: [
      "/images/edificio-montemar-cover.jpg",
      "/images/edificio-montemar-2.jpg",
    ],
  },
  {
    id: "edificio-vista-al-mar",
    title: "Edificio Vista al Mar",
    year: 2020, // TODO: confirmar año con el estudio
    location: "quinta-region",
    type: "residencial-departamento",
    description:
      "Edificio residencial orientado al océano. Cada departamento se ordena para asegurar la vista al mar a través de paños vidriados de gran formato.",
    cover: "/images/edificio-vista-al-mar-cover.jpg",
    gallery: ["/images/edificio-vista-al-mar-cover.jpg"],
  },
  {
    id: "edificio-colores",
    title: "Edificio Colores",
    year: 2020, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento",
    description:
      "Edificio residencial donde el color asume un rol compositivo. Tonos sobrios articulan la fachada y ordenan la lectura de cada nivel.",
    cover: "/images/edificio-colores-cover.jpg",
    gallery: ["/images/edificio-colores-cover.jpg"],
  },
  {
    id: "edificio-concon",
    title: "Edificio Concón",
    year: 2019, // TODO: confirmar año con el estudio
    location: "quinta-region",
    type: "residencial-departamento",
    description:
      "Edificio residencial en Concón. La fachada blanca de líneas horizontales se acomoda al perfil urbano costero y maximiza la incidencia de luz natural.",
    cover: "/images/edificio-concon-cover.jpg",
    gallery: ["/images/edificio-concon-cover.jpg"],
  },
  {
    id: "edificio-renaca",
    title: "Edificio Reñaca",
    year: 2024, // TODO: confirmar año con el estudio
    location: "quinta-region",
    type: "residencial-departamento",
    description:
      "Edificio residencial en el sector de Reñaca. El proyecto busca una silueta limpia que dialogue con la pendiente y abra las plantas hacia la bahía.",
    cover: "/images/edificio-renaca-cover.jpg",
    gallery: [
      "/images/edificio-renaca-cover.jpg",
      "/images/edificio-renaca-2.jpg",
    ],
  },
  {
    id: "edificio-6-oriente",
    title: "Edificio 6 Oriente",
    year: 2019, // TODO: confirmar año con el estudio
    location: "quinta-region",
    type: "residencial-departamento", // TODO: confirmar tipo con el estudio
    description:
      "Edificio en pleno tejido urbano de Viña del Mar. Volumen compacto que aprovecha la totalidad del predio y resuelve la fachada con materialidad sobria.",
    cover: "/images/edificio-6-oriente-cover.jpg",
    gallery: ["/images/edificio-6-oriente-cover.jpg"],
  },
  {
    id: "edificio-buin",
    title: "Edificio Buin",
    year: 2022, // TODO: confirmar año con el estudio
    location: "region-metropolitana",
    type: "residencial-departamento", // TODO: confirmar tipo con el estudio
    description:
      "Edificio residencial en la comuna de Buin. La envolvente combina paños macizos y aberturas calibradas para responder al asoleamiento del valle central.",
    cover: "/images/edificio-buin-cover.jpg",
    gallery: ["/images/edificio-buin-cover.jpg"],
  },
  {
    id: "lote-c",
    title: "Lote C",
    year: 2024, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-departamento", // TODO: confirmar tipo con el estudio
    description:
      "Proyecto residencial en desarrollo. Estudio volumétrico que define la implantación, la altura y la relación del edificio con su entorno inmediato.",
    cover: "/images/lote-c-cover.jpg",
    gallery: ["/images/lote-c-cover.jpg", "/images/lote-c-2.jpg"],
  },

  // === Casas (residencial-casa) ===
  {
    id: "casa-habitacional",
    title: "Casa Habitacional",
    year: 2022, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "residencial-casa",
    description:
      "Vivienda unifamiliar de geometría serena. Los volúmenes blancos se articulan en torno a patios y terrazas que ordenan la vida doméstica.",
    cover: "/images/casa-habitacional-cover.jpg",
    gallery: [
      "/images/casa-habitacional-cover.jpg",
      "/images/casa-habitacional-2.jpg",
    ],
  },

  // === Comerciales / institucionales (mapeados a "oficinas") ===
  {
    id: "boulevar-infinito",
    title: "Boulevar Infinito",
    year: 2023, // TODO: confirmar año con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "oficinas",
    description:
      "Proyecto comercial concebido como un eje peatonal continuo. La cubierta y los locales se ordenan para acompañar el recorrido y favorecer el encuentro.",
    cover: "/images/boulevar-infinito-cover.jpg",
    gallery: [
      "/images/boulevar-infinito-cover.jpg",
      "/images/boulevar-infinito-2.jpg",
      "/images/boulevar-infinito-3.jpg",
    ],
  },
  {
    id: "centro-belloto",
    title: "Centro Belloto",
    year: 2021, // TODO: confirmar año con el estudio
    location: "quinta-region",
    type: "oficinas",
    description:
      "Centro comercial en El Belloto. Volumen bajo y fachada metálica que organizan los locales en torno a un patio común de doble altura.",
    cover: "/images/centro-belloto-cover.jpg",
    gallery: [
      "/images/centro-belloto-cover.jpg",
      "/images/centro-belloto-2.jpg",
    ],
  },
  {
    id: "siete-norte",
    title: "7 Norte",
    year: 2020, // TODO: confirmar año con el estudio
    location: "quinta-region",
    type: "oficinas",
    description:
      "Proyecto institucional sobre la avenida 7 Norte de Viña del Mar. Volumen austero, ritmo de vanos verticales y zócalo permeable hacia la calle.",
    cover: "/images/siete-norte-cover.jpg",
    gallery: [
      "/images/siete-norte-cover.jpg",
      "/images/siete-norte-2.jpg",
      "/images/siete-norte-3.jpg",
    ],
  },
  {
    id: "sanatorio",
    title: "Sanatorio",
    year: 2019, // TODO: confirmar año y nombre exacto con el estudio
    location: "quinta-region", // TODO: confirmar ubicación con el estudio
    type: "oficinas", // TODO: tipo institucional/salud — actualizar si se amplían los filtros de "tipo"
    description:
      "Proyecto institucional de carácter sanitario. Los volúmenes se ordenan para resolver circulaciones diferenciadas, control lumínico y un ingreso jerárquico.",
    cover: "/images/sanatorio-cover.jpg",
    gallery: [
      "/images/sanatorio-cover.jpg",
      "/images/sanatorio-2.jpg",
      "/images/sanatorio-3.jpg",
    ],
  },
];
