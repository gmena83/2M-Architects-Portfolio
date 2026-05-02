import type { ProjectLocation, ProjectType } from "@/lib/projects";

export const LOCATION_LABELS: Record<ProjectLocation, string> = {
  "quinta-region": "Quinta Región",
  "region-metropolitana": "Región Metropolitana",
  argentina: "Argentina",
};

export const TYPE_LABELS: Record<ProjectType, string> = {
  "residencial-casa": "Residencial Casa",
  "residencial-departamento": "Residencial Departamento",
  oficinas: "Oficinas",
};

export function locationLabel(value: string): string {
  return LOCATION_LABELS[value as ProjectLocation] ?? value;
}

export function typeLabel(value: string): string {
  return TYPE_LABELS[value as ProjectType] ?? value;
}
