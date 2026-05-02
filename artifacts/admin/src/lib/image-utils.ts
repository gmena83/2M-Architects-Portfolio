export function resolveImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('/objects/')) return `/api/storage${path}`;
  return path;
}
