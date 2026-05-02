import {
  db,
  projectsTable,
  projectImagesTable,
  pool,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { readFile, stat, access } from "node:fs/promises";
import path from "node:path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const PRIVATE_OBJECT_DIR = process.env.PRIVATE_OBJECT_DIR;
if (!PRIVATE_OBJECT_DIR) {
  throw new Error("PRIVATE_OBJECT_DIR not set");
}

const RAR_ROOT = "/tmp/rar_extract/2mArq";

type Mapping = { slug: string; files: string[] };

const mappings: Mapping[] = [
  {
    slug: "edificio-bella-brizza",
    files: [
      "EDIFICIOS/BELLA BRIZZA 1.JPG",
      "EDIFICIOS/BELLA BRIZZA 2.JPG",
      "EDIFICIOS/BELLA BRIZZA 3.JPG",
    ],
  },
  {
    slug: "edificio-melinka",
    files: [
      "EDIFICIOS/MELINKA 1.jpg",
      "EDIFICIOS/MELINKA 2.jpg",
      "EDIFICIOS/MELINKA 3.jpg",
      "EDIFICIOS/MELINKA 4.jpg",
    ],
  },
  {
    slug: "edificio-foresta",
    files: [
      "EDIFICIOS/FORESTA 1.jpg",
      "EDIFICIOS/FORESTA 2.jpg",
      "EDIFICIOS/FORESTA 3.jpg",
    ],
  },
  {
    slug: "edificio-lautaro",
    files: [
      "EDIFICIOS/LAUTARO 1.JPG",
      "EDIFICIOS/LAUTARO 2.JPG",
      "EDIFICIOS/LAUTARO 22.JPG",
    ],
  },
  {
    slug: "edificio-parque",
    files: ["EDIFICIOS/PARQUE 1.JPG", "EDIFICIOS/PARQUE 2.JPG"],
  },
  {
    slug: "edificio-alessandri",
    files: ["EDIFICIOS/ALESSANDRI 1.jpg", "ALESSANDRI 2.jpg"],
  },
  {
    slug: "edificio-montemar",
    files: ["EDIFICIOS/MONTEMAR 2.jpg", "EDIFICIOS/MONTEMAR 3.jpg"],
  },
  {
    slug: "edificio-vista-al-mar",
    files: ["EDIFICIOS/VISTA AL MAR 1.JPG"],
  },
  {
    slug: "edificio-colores",
    files: ["EDIFICIOS/COLORES 2.jpg"],
  },
  {
    slug: "edificio-concon",
    files: ["CONCON1.jpg"],
  },
  {
    slug: "edificio-renaca",
    files: ["REÑACA 1.JPG", "PROYECTOS/REÑACA 2.JPG"],
  },
  {
    slug: "edificio-6-oriente",
    files: ["6 ORIENTE 1.JPG"],
  },
  {
    slug: "edificio-buin",
    files: ["BUIN.jpg"],
  },
  {
    slug: "lote-c",
    files: ["LOTE C.jpg", "PROYECTOS/LOTE C2.jpg"],
  },
  {
    slug: "casa-habitacional",
    files: ["HABITACIONALES/CASA 1.JPG", "HABITACIONALES/CASA 2.JPG"],
  },
  {
    slug: "boulevar-infinito",
    files: [
      "BOULEVAR INFINITO 1.jpg",
      "COMERCIALES/BOULEVAR INFINITO 2.jpg",
      "COMERCIALES/BOULEVAR INFINITO 3.jpg",
    ],
  },
  {
    slug: "centro-belloto",
    files: ["COMERCIALES/BELLOTO.jpg", "BELLOTO 3.jpg"],
  },
  {
    slug: "siete-norte",
    files: [
      "INSTITUCIONALES/7  NORTE 1.JPG",
      "7 NORTE 2.JPG",
      "7 NORTE 3.JPG",
    ],
  },
  {
    slug: "sanatorio",
    files: [
      "INSTITUCIONALES/SANATORIO 1.jpg",
      "INSTITUCIONALES/SANANTORIO 2.jpg",
      "INSTITUCIONALES/SANANTORIO 3.jpg",
    ],
  },
];

function parseObjectPath(p: string): { bucketName: string; objectName: string } {
  if (!p.startsWith("/")) p = `/${p}`;
  const parts = p.split("/");
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

async function signPutUrl(objectName: string, bucketName: string): Promise<string> {
  const res = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket_name: bucketName,
        object_name: objectName,
        method: "PUT",
        expires_at: new Date(Date.now() + 900 * 1000).toISOString(),
      }),
    },
  );
  if (!res.ok) throw new Error(`sign failed ${res.status}: ${await res.text()}`);
  const { signed_url } = (await res.json()) as { signed_url: string };
  return signed_url;
}

async function uploadFile(localPath: string): Promise<string> {
  const objectId = randomUUID();
  const fullPath = `${PRIVATE_OBJECT_DIR}/uploads/${objectId}`;
  const { bucketName, objectName } = parseObjectPath(fullPath);
  const uploadUrl = await signPutUrl(objectName, bucketName);

  const buf = await readFile(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";

  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: buf,
  });
  if (!put.ok) throw new Error(`upload failed ${put.status}: ${await put.text()}`);

  return `/objects/uploads/${objectId}`;
}

async function main() {
  // Validate all source files exist first.
  const missing: string[] = [];
  for (const m of mappings) {
    for (const f of m.files) {
      const abs = path.join(RAR_ROOT, f);
      try {
        await access(abs);
      } catch {
        missing.push(abs);
      }
    }
  }
  if (missing.length) {
    console.error("Missing source files:");
    for (const f of missing) console.error("  " + f);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;
  for (const m of mappings) {
    const [project] = await db
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(eq(projectsTable.slug, m.slug))
      .limit(1);
    if (!project) {
      console.log(`  [skip] ${m.slug}: no existe en BD`);
      skipped++;
      continue;
    }

    const uploadedPaths: string[] = [];
    for (const f of m.files) {
      const abs = path.join(RAR_ROOT, f);
      const size = (await stat(abs)).size;
      const objectPath = await uploadFile(abs);
      uploadedPaths.push(objectPath);
      console.log(`    ↑ ${f} (${size} bytes) → ${objectPath}`);
    }

    await db
      .update(projectsTable)
      .set({ coverImagePath: uploadedPaths[0] })
      .where(eq(projectsTable.id, project.id));

    await db
      .delete(projectImagesTable)
      .where(eq(projectImagesTable.projectId, project.id));

    await db.insert(projectImagesTable).values(
      uploadedPaths.map((p, idx) => ({
        projectId: project.id,
        imagePath: p,
        sortOrder: idx,
      })),
    );

    console.log(`  [ok]   ${m.slug} (${uploadedPaths.length} imágenes)`);
    updated++;
  }

  console.log(`Listo. Actualizados=${updated}, Omitidos=${skipped}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
