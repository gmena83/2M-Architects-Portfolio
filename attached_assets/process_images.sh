#!/usr/bin/env bash
set -euo pipefail

SRC="attached_assets/2mArq_extracted/2mArq"
DST="artifacts/site/public/images"

# Process: resize to max 1920px wide (no upscale), quality 82, sRGB, strip metadata, output JPG.
proc() {
  local src="$1" out="$2"
  magick "$src" -auto-orient -resize '1920x1920>' -strip -interlace Plane -colorspace sRGB -quality 82 "$DST/$out"
  echo "  $(du -h "$DST/$out" | cut -f1)  $out"
}

# === EDIFICIOS (residencial-departamento) ===

# Alessandri: EDIF/ALESSANDRI 1 (cover) + loose ALESSANDRI 2
proc "$SRC/EDIFICIOS/ALESSANDRI 1.jpg"          "edificio-alessandri-cover.jpg"
proc "$SRC/ALESSANDRI 2.jpg"                    "edificio-alessandri-2.jpg"

# Bella Brizza: 1/2/3
proc "$SRC/EDIFICIOS/BELLA BRIZZA 1.JPG"        "edificio-bella-brizza-cover.jpg"
proc "$SRC/EDIFICIOS/BELLA BRIZZA 2.JPG"        "edificio-bella-brizza-2.jpg"
proc "$SRC/EDIFICIOS/BELLA BRIZZA 3.JPG"        "edificio-bella-brizza-3.jpg"

# Colores: only "2" exists, use it as cover
proc "$SRC/EDIFICIOS/COLORES 2.jpg"             "edificio-colores-cover.jpg"

# Foresta: 1/2/3
proc "$SRC/EDIFICIOS/FORESTA 1.jpg"             "edificio-foresta-cover.jpg"
proc "$SRC/EDIFICIOS/FORESTA 2.jpg"             "edificio-foresta-2.jpg"
proc "$SRC/EDIFICIOS/FORESTA 3.jpg"             "edificio-foresta-3.jpg"

# Lautaro: 1/2/22 (use 22 as third gallery, smaller numbers first)
proc "$SRC/EDIFICIOS/LAUTARO 1.JPG"             "edificio-lautaro-cover.jpg"
proc "$SRC/EDIFICIOS/LAUTARO 2.JPG"             "edificio-lautaro-2.jpg"
proc "$SRC/EDIFICIOS/LAUTARO 22.JPG"            "edificio-lautaro-3.jpg"

# Melinka: 1/2/3/4
proc "$SRC/EDIFICIOS/MELINKA 1.jpg"             "edificio-melinka-cover.jpg"
proc "$SRC/EDIFICIOS/MELINKA 2.jpg"             "edificio-melinka-2.jpg"
proc "$SRC/EDIFICIOS/MELINKA 3.jpg"             "edificio-melinka-3.jpg"
proc "$SRC/EDIFICIOS/MELINKA 4.jpg"             "edificio-melinka-4.jpg"

# Montemar: 2/3 (no 1 in archive — use 2 as cover)
proc "$SRC/EDIFICIOS/MONTEMAR 2.jpg"            "edificio-montemar-cover.jpg"
proc "$SRC/EDIFICIOS/MONTEMAR 3.jpg"            "edificio-montemar-2.jpg"

# Parque: 1/2
proc "$SRC/EDIFICIOS/PARQUE 1.JPG"              "edificio-parque-cover.jpg"
proc "$SRC/EDIFICIOS/PARQUE 2.JPG"              "edificio-parque-2.jpg"

# Vista al Mar: 1
proc "$SRC/EDIFICIOS/VISTA AL MAR 1.JPG"        "edificio-vista-al-mar-cover.jpg"

# 6 Oriente (loose, single)
proc "$SRC/6 ORIENTE 1.JPG"                     "edificio-6-oriente-cover.jpg"

# Concón (loose, single)
proc "$SRC/CONCON1.jpg"                         "edificio-concon-cover.jpg"

# Buin (loose, single)
proc "$SRC/BUIN.jpg"                            "edificio-buin-cover.jpg"

# Reñaca (loose 1 + PROYECTOS 2)
proc "$SRC/REÑACA 1.JPG"                        "edificio-renaca-cover.jpg"
proc "$SRC/PROYECTOS/REÑACA 2.JPG"              "edificio-renaca-2.jpg"

# Lote C (loose 1 + PROYECTOS C2)
proc "$SRC/LOTE C.jpg"                          "lote-c-cover.jpg"
proc "$SRC/PROYECTOS/LOTE C2.jpg"               "lote-c-2.jpg"

# === COMERCIALES (oficinas) ===

# Belloto (comerciales BELLOTO is cover; loose BELLOTO 3 as gallery)
proc "$SRC/COMERCIALES/BELLOTO.jpg"             "centro-belloto-cover.jpg"
proc "$SRC/BELLOTO 3.jpg"                       "centro-belloto-2.jpg"

# Boulevar Infinito: loose 1 (cover) + comerciales 2/3
proc "$SRC/BOULEVAR INFINITO 1.jpg"             "boulevar-infinito-cover.jpg"
proc "$SRC/COMERCIALES/BOULEVAR INFINITO 2.jpg" "boulevar-infinito-2.jpg"
proc "$SRC/COMERCIALES/BOULEVAR INFINITO 3.jpg" "boulevar-infinito-3.jpg"

# === HABITACIONALES (residencial-casa) ===

# Casa Habitacional: 1/2
proc "$SRC/HABITACIONALES/CASA 1.JPG"           "casa-habitacional-cover.jpg"
proc "$SRC/HABITACIONALES/CASA 2.JPG"           "casa-habitacional-2.jpg"

# === INSTITUCIONALES (oficinas, closest fit) ===

# Sanatorio: SANATORIO 1 (cover), SANANTORIO 2/3 (gallery — typo in source kept as-is)
proc "$SRC/INSTITUCIONALES/SANATORIO 1.jpg"     "sanatorio-cover.jpg"
proc "$SRC/INSTITUCIONALES/SANANTORIO 2.jpg"    "sanatorio-2.jpg"
proc "$SRC/INSTITUCIONALES/SANANTORIO 3.jpg"    "sanatorio-3.jpg"

# 7 Norte: institutional 1 (cover) + loose 2/3
proc "$SRC/INSTITUCIONALES/7  NORTE 1.JPG"      "siete-norte-cover.jpg"
proc "$SRC/7 NORTE 2.JPG"                       "siete-norte-2.jpg"
proc "$SRC/7 NORTE 3.JPG"                       "siete-norte-3.jpg"

echo
echo "Total in $DST:"
du -sh "$DST"
echo
echo "Largest files:"
ls -lSh "$DST" | head -10
