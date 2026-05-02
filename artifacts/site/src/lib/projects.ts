import type { Project as ApiProject, ProjectImage as ApiProjectImage } from "@workspace/api-client-react";

export type ProjectLocation = "quinta-region" | "region-metropolitana" | "argentina";
export type ProjectType =
  | "residencial-casa"
  | "residencial-departamento"
  | "oficinas";

export type Project = ApiProject;
export type ProjectImage = ApiProjectImage;

export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path;
}

export function getCoverUrl(project: Project): string {
  return resolveImageUrl(project.coverImagePath);
}

export function getGalleryUrls(project: Project): string[] {
  const sorted = [...project.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const urls = sorted.map((i) => resolveImageUrl(i.imagePath));
  if (urls.length > 0) return urls;
  const cover = getCoverUrl(project);
  return cover ? [cover] : [];
}
