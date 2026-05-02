export type MediaLink = {
  label: string;
  url: string;
};

export type MediaItem = {
  title: string;
  description: string;
  source: string;
  year?: string;
  url?: string;
  links?: MediaLink[];
  thumbnail?: string;
};

export type MediaGroup = {
  id: string;
  title: string;
  items: MediaItem[];
};

export const mediaGroups: MediaGroup[] = [
  {
    id: "publicaciones",
    title: "Publicaciones académicas y técnicas",
    items: [
      {
        title:
          "Valparaíso Metropolitano: el urbanista Carlos Mena M., Jefe de la Oficina del Plano Intercomunal de Valparaíso, nos entrega su diagnóstico de la ciudad",
        description:
          "Entrevista de Carlos Mena Manía en la Revista AUCA donde analiza el desarrollo metropolitano de Valparaíso y el Plan Intercomunal a su cargo.",
        source: "Revista AUCA Núm. 11 — Universidad de Chile",
        year: "1968",
        url: "https://revistaauca.uchile.cl/index.php/AUCA/article/view/58999",
        thumbnail: "/images/media/auca.svg",
      },
      {
        title: "Los primeros planes intercomunales Metropolitanos de Chile, Vol. III",
        description:
          "Libro académico del sello editorial UCh que documenta los primeros planes intercomunales del país y cita a Carlos Mena Manía como figura central del Plan Intercomunal de Valparaíso.",
        source: "Repositorio Universidad de Chile / Libros UCh",
        year: "2025",
        url: "https://repositorio.uchile.cl/bitstream/2250/184594/1/Los-primeros-planes-intercomunales.pdf",
        thumbnail: "/images/media/uch.svg",
      },
      {
        title:
          "Valparaíso Metropolitano: el urbanista Carlos Mena M. Jefe de la Oficina del Plano Intercomunal de Valparaíso",
        description:
          "Registro del artículo de la Revista AUCA en el repositorio científico hispanohablante Dialnet (Universidad de La Rioja).",
        source: "Dialnet",
        url: "https://dialnet.unirioja.es/servlet/articulo?codigo=10325526",
        thumbnail: "/images/media/dialnet.svg",
      },
    ],
  },
  {
    id: "prensa",
    title: "Prensa y notas gremiales",
    items: [
      {
        title:
          "Expertos enjuician los mayores problemas que explican el deterioro de Viña del Mar",
        description:
          "Gonzalo Mena Améstiga participa como experto local con una opinión técnica sobre los problemas urbanos y arquitectónicos de la ciudad.",
        source: "Coproch — Corporación Pro Viña del Mar",
        year: "2016",
        url: "https://www.coproch.cl/expertos-enjuician-los-mayores-problemas-que-explican-el-deterioro-de-vina-del-mar/",
        thumbnail: "/images/media/coproch.svg",
      },
      {
        title:
          "Cena Anual de Socios y Socias CChC Valparaíso 2023: camaradería y distinción a la excelencia en el gremio",
        description:
          "Nota institucional sobre la cena anual de socios de la Cámara Chilena de la Construcción, sede Valparaíso, donde Gonzalo Mena Améstiga participa como socio activo.",
        source: "CChC Valparaíso",
        year: "2023",
        url: "https://cchc.cl/noticias/cena-anual-de-socios-y-socias-cchc-valparaiso-2023-camaraderia-y-distincion-a-la-excelencia-en-el-gremio/",
        thumbnail: "/images/media/cchc.svg",
      },
      {
        title:
          "Encuentro de Socios y Socias CChC Valparaíso 2023: una camaradería que vence al tiempo",
        description:
          "Cobertura del encuentro anual de socios de la CChC Valparaíso, parte de la actividad gremial de larga data del estudio en la región.",
        source: "CChC Valparaíso",
        year: "2023",
        url: "https://cchc.cl/w/noticias/encuentro-de-socios-y-socias-cchc-valparaiso-2023-una-camaraderia-que-vence-al-tiempo",
        thumbnail: "/images/media/cchc.svg",
      },
      {
        title: "Distinciones Cena Anual de Socios CChC Valparaíso",
        description:
          "Publicación oficial en Instagram del canal de la CChC Valparaíso con las distinciones entregadas en la Cena Anual de Socios 2025.",
        source: "Instagram CChC Valparaíso",
        year: "2025",
        url: "https://www.instagram.com/p/DPmYS-HkdDu/",
        thumbnail: "/images/media/cchc-instagram.svg",
      },
      {
        title: "La Ruta del Café del Socio CChC Valparaíso",
        description:
          "Cobertura del programa Café del Socio, instancia de encuentro gremial entre socios del sector construcción y arquitectura de la región.",
        source: "Mundo Socios CChC",
        url: "https://mundosocioscchc.cl/la-ruta-del-cafe-del-socio-cchc-valparaiso/",
        thumbnail: "/images/media/mundo-socios.svg",
      },
    ],
  },
  {
    id: "permisos",
    title: "Proyectos y permisos oficiales",
    items: [
      {
        title: "Edificio Residencial Molinos de Santa Ana",
        description:
          "Registro en el Portal ONDAC del proyecto residencial vinculado a Asesorías 2M Arquitectos y Asociados Limitada.",
        source: "Portal ONDAC",
        url: "https://portal.ondac.com/601/w3-article-165470.html",
        thumbnail: "/images/media/ondac.svg",
      },
      {
        title: "Permisos DOM — Municipalidad de Viña del Mar",
        description:
          "Registros de permisos de la Dirección de Obras Municipales de Viña del Mar donde figuran proyectos con participación de 2M Arquitectos en distintos años.",
        source: "Transparencia Activa — Municipalidad de Viña del Mar",
        links: [
          {
            label: "Junio 2011",
            url: "https://transparencia.vinadelmarchile.cl/download/0/ac720dd8e5557ac93e1dffe452a1e3aa.html",
          },
          {
            label: "Noviembre 2011",
            url: "https://transparencia.munivina.cl/download/0/22f0609d15b7deffb9a5f1298aa9bb87.html",
          },
          {
            label: "Diciembre 2013",
            url: "https://transparencia.munivina.cl/download/0/7bf5138a39cc093555fd353ea940c908.html",
          },
          {
            label: "Abril 2014",
            url: "https://transparencia.munivina.cl/download/0/edaf54e13c66102fe97a1d25d560139c.html",
          },
          {
            label: "Julio 2014",
            url: "https://transparencia.munivina.cl/download/0/27c6eb922c10d864534431706249db1b.html",
          },
        ],
        thumbnail: "/images/media/vina.svg",
      },
      {
        title: "Permisos de Obras — Municipalidad de Concón",
        description:
          "Registros oficiales de permisos de edificación en Concón, donde 2M Arquitectos figura como oficina proyectista.",
        source: "Transparencia Activa — Municipalidad de Concón",
        links: [
          {
            label: "2015",
            url: "https://transparenciaconcon.cl/Transparencia/07%20ActosSobreTerceros/PermisosObras/2015/ver%20documentos/RESOL2015-118.pdf",
          },
          {
            label: "Julio 2023",
            url: "https://transparenciaconcon.cl/upload/planilla/07_actosyresoluciones/Permiso%20de%20Obras%202023/Julio/RESOL2023-200.pdf",
          },
          {
            label: "Abril 2024",
            url: "https://transparenciaconcon.cl/upload/planilla/07_actosyresoluciones/Permiso%20de%20Obras%202024/Abril/RESOL2024-098.pdf",
          },
          {
            label: "Diciembre 2024",
            url: "https://transparenciaconcon.cl/upload/planilla/07_actosyresoluciones/Permiso%20de%20Obras%202024/Diciembre/RESOL2024-267.pdf",
          },
        ],
        thumbnail: "/images/media/concon.svg",
      },
    ],
  },
  {
    id: "registros",
    title: "Registros y directorios profesionales",
    items: [
      {
        title: "Asesorías 2M Arquitectos y Asociados Limitada",
        description:
          "Ficha empresarial oficial con datos de constitución, domicilio en Viña del Mar y actividad de consultoría arquitectónica.",
        source: "Mercantil.com",
        url: "https://www.mercantil.com/empresa/asesorias-2m-arquitectos-y-asociados-limitada/vina-del-mar/300464202/esp/",
        thumbnail: "/images/media/mercantil.svg",
      },
      {
        title: "Asesorías 2M Arquitectos y Asociados Limitada — RUT empresa",
        description:
          "Registro del RUT y razón social del estudio en la base de datos de empresas chilenas.",
        source: "Genealog.cl",
        url: "https://www.genealog.cl/Geneanexus/empresa/CHILE/TNzYxTwMjQzMzUtNw-jTw/nombre-y-rut/ASESORIAS-2M-ARQUITECTOS-Y-ASOCIADOS-LIMITAD/",
        thumbnail: "/images/media/genealog.svg",
      },
      {
        title: "Gonzalo J. Mena Améstiga — Directorio personal",
        description:
          "Ficha del directorio telefónico con datos de contacto profesional en Viña del Mar.",
        source: "abctelefonos.com",
        url: "https://www.abctelefonos.com/mena_amestica_gonzalo_j__cl_1069702",
        thumbnail: "/images/media/abc.svg",
      },
      {
        title: "2M Arquitectos en LinkedIn",
        description:
          "Perfil institucional del estudio y de los profesionales asociados que reflejan su estructura de trabajo.",
        source: "LinkedIn",
        links: [
          {
            label: "2M Arquitectos",
            url: "https://www.linkedin.com/in/2m-arquitectos-30773356",
          },
          {
            label: "Marco Valenzuela",
            url: "https://www.linkedin.com/in/marco-valenzuela-4732a752",
          },
          {
            label: "Felipe Ponce Petruccelli",
            url: "https://www.linkedin.com/in/felipe-ponce-petruccelli",
          },
          {
            label: "Pablo Quezada Aguirre",
            url: "https://www.linkedin.com/in/pablo-quezadaa",
          },
        ],
        thumbnail: "/images/media/linkedin.svg",
      },
      {
        title: "Asesorías 2M Arquitectos y Asociados Limitada",
        description:
          "Ficha de la firma como empleador en el sector de arquitectura y construcción dentro de la plataforma laboral de Duoc UC.",
        source: "Duoc Laboral",
        url: "https://duoclaboral.cl/trabajar-en-asesorias-2m-arquitectos-y-asociados-limitada",
        thumbnail: "/images/media/duoc.svg",
      },
    ],
  },
  {
    id: "contexto",
    title: "Contexto urbano — Plan Intercomunal de Valparaíso",
    items: [
      {
        title: "Revista AUCA Núm. 11 (1968): Valparaíso — Índice del número completo",
        description:
          "Índice del número monográfico de la Revista AUCA dedicado a Valparaíso, donde se publicó el artículo de Carlos Mena Manía sobre el Plan Intercomunal.",
        source: "Revista AUCA — Universidad de Chile",
        year: "1968",
        url: "https://revistaauca.uchile.cl/index.php/AUCA/issue/view/5484",
        thumbnail: "/images/media/auca.svg",
      },
      {
        title: "Los primeros planes intercomunales metropolitanos de Chile",
        description:
          "Acceso abierto al texto completo del libro a través del repositorio académico internacional Core.ac.uk.",
        source: "Core.ac.uk",
        url: "https://core.ac.uk/reader/650268053",
        thumbnail: "/images/media/core.svg",
      },
    ],
  },
];
