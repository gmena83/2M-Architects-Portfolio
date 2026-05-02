import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc } from "drizzle-orm";
import {
  db,
  projectsTable,
  projectImagesTable,
  type Project as DbProject,
  type ProjectImage as DbProjectImage,
} from "@workspace/db";
import {
  AdminCreateProjectBody,
  AdminUpdateProjectBody,
  AdminGetProjectParams,
  AdminDeleteProjectParams,
  AdminReplaceProjectImagesParams,
  AdminReplaceProjectImagesBody,
  GetProjectBySlugParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

interface ProjectWithImages extends DbProject {
  images: DbProjectImage[];
}

async function loadProjects(): Promise<ProjectWithImages[]> {
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.createdAt));

  if (projects.length === 0) return [];

  const images = await db
    .select()
    .from(projectImagesTable)
    .orderBy(asc(projectImagesTable.sortOrder));

  const byProject = new Map<string, DbProjectImage[]>();
  for (const img of images) {
    const arr = byProject.get(img.projectId) ?? [];
    arr.push(img);
    byProject.set(img.projectId, arr);
  }

  return projects.map((p) => ({ ...p, images: byProject.get(p.id) ?? [] }));
}

async function loadProjectById(id: string): Promise<ProjectWithImages | null> {
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  if (!project) return null;
  const images = await db
    .select()
    .from(projectImagesTable)
    .where(eq(projectImagesTable.projectId, id))
    .orderBy(asc(projectImagesTable.sortOrder));
  return { ...project, images };
}

async function loadProjectBySlug(
  slug: string,
): Promise<ProjectWithImages | null> {
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);
  if (!project) return null;
  const images = await db
    .select()
    .from(projectImagesTable)
    .where(eq(projectImagesTable.projectId, project.id))
    .orderBy(asc(projectImagesTable.sortOrder));
  return { ...project, images };
}

// === PUBLIC ===

router.get("/projects", async (req: Request, res: Response) => {
  try {
    const all = await loadProjects();
    res.json(all);
  } catch (err) {
    req.log.error({ err }, "Failed to list projects");
    res
      .status(500)
      .json({ error: "No fue posible cargar los proyectos en este momento." });
  }
});

router.get("/projects/:slug", async (req: Request, res: Response) => {
  const params = GetProjectBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Slug inválido" });
    return;
  }
  try {
    const project = await loadProjectBySlug(params.data.slug);
    if (!project) {
      res.status(404).json({ error: "Proyecto no encontrado" });
      return;
    }
    res.json(project);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch project");
    res
      .status(500)
      .json({ error: "No fue posible cargar el proyecto en este momento." });
  }
});

// === ADMIN ===

router.get(
  "/admin/projects",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const all = await loadProjects();
      res.json(all);
    } catch (err) {
      req.log.error({ err }, "Failed to admin list projects");
      res.status(500).json({ error: "Error interno" });
    }
  },
);

router.get(
  "/admin/projects/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const params = AdminGetProjectParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Identificador inválido" });
      return;
    }
    try {
      const project = await loadProjectById(params.data.id);
      if (!project) {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
      }
      res.json(project);
    } catch (err) {
      req.log.error({ err }, "Failed to admin get project");
      res.status(500).json({ error: "Error interno" });
    }
  },
);

router.post(
  "/admin/projects",
  requireAuth,
  async (req: Request, res: Response) => {
    const body = AdminCreateProjectBody.safeParse(req.body);
    if (!body.success) {
      res
        .status(400)
        .json({ error: "Datos inválidos. Revisa los campos del proyecto." });
      return;
    }
    try {
      const existing = await db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(eq(projectsTable.slug, body.data.slug))
        .limit(1);
      if (existing.length > 0) {
        res
          .status(409)
          .json({ error: "Ya existe un proyecto con ese identificador (slug)." });
        return;
      }

      const [created] = await db
        .insert(projectsTable)
        .values({
          slug: body.data.slug,
          title: body.data.title,
          year: body.data.year,
          location: body.data.location,
          type: body.data.type,
          description: body.data.description ?? "",
          coverImagePath: body.data.coverImagePath,
          sortOrder: body.data.sortOrder ?? 0,
        })
        .returning();
      const full = await loadProjectById(created.id);
      res.status(201).json(full);
    } catch (err) {
      req.log.error({ err }, "Failed to create project");
      res.status(500).json({ error: "Error interno al crear el proyecto." });
    }
  },
);

router.patch(
  "/admin/projects/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const params = AdminGetProjectParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Identificador inválido" });
      return;
    }
    const body = AdminUpdateProjectBody.safeParse(req.body);
    if (!body.success) {
      res
        .status(400)
        .json({ error: "Datos inválidos. Revisa los campos del proyecto." });
      return;
    }
    try {
      const existing = await loadProjectById(params.data.id);
      if (!existing) {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
      }

      if (body.data.slug !== existing.slug) {
        const slugTaken = await db
          .select({ id: projectsTable.id })
          .from(projectsTable)
          .where(eq(projectsTable.slug, body.data.slug))
          .limit(1);
        if (slugTaken.length > 0) {
          res.status(409).json({
            error: "Ya existe otro proyecto con ese identificador (slug).",
          });
          return;
        }
      }

      await db
        .update(projectsTable)
        .set({
          slug: body.data.slug,
          title: body.data.title,
          year: body.data.year,
          location: body.data.location,
          type: body.data.type,
          description: body.data.description ?? "",
          coverImagePath: body.data.coverImagePath,
          sortOrder: body.data.sortOrder ?? existing.sortOrder,
        })
        .where(eq(projectsTable.id, params.data.id));

      const updated = await loadProjectById(params.data.id);
      res.json(updated);
    } catch (err) {
      req.log.error({ err }, "Failed to update project");
      res
        .status(500)
        .json({ error: "Error interno al actualizar el proyecto." });
    }
  },
);

router.delete(
  "/admin/projects/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const params = AdminDeleteProjectParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Identificador inválido" });
      return;
    }
    try {
      const existing = await loadProjectById(params.data.id);
      if (!existing) {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
      }
      await db.delete(projectsTable).where(eq(projectsTable.id, params.data.id));
      res.status(204).send();
    } catch (err) {
      req.log.error({ err }, "Failed to delete project");
      res.status(500).json({ error: "Error interno al eliminar el proyecto." });
    }
  },
);

router.put(
  "/admin/projects/:id/images",
  requireAuth,
  async (req: Request, res: Response) => {
    const params = AdminReplaceProjectImagesParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Identificador inválido" });
      return;
    }
    const body = AdminReplaceProjectImagesBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Lista de imágenes inválida." });
      return;
    }
    try {
      const existing = await loadProjectById(params.data.id);
      if (!existing) {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
      }

      await db.transaction(async (tx) => {
        await tx
          .delete(projectImagesTable)
          .where(eq(projectImagesTable.projectId, params.data.id));

        if (body.data.images.length > 0) {
          await tx.insert(projectImagesTable).values(
            body.data.images.map((img, idx) => ({
              projectId: params.data.id,
              imagePath: img.imagePath,
              sortOrder: idx,
            })),
          );
        }
      });

      const updated = await loadProjectById(params.data.id);
      res.json(updated);
    } catch (err) {
      req.log.error({ err }, "Failed to replace project images");
      res
        .status(500)
        .json({ error: "Error interno al actualizar las imágenes." });
    }
  },
);

export default router;
