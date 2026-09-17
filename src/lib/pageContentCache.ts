import { prisma } from "@/lib/prisma";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL_MS = 1000 * 60 * 15; // 15 minutes ultra-fast in-memory cache

/**
 * High-performance cached query for Page Content
 * Returns in < 0.05ms on cache hit
 */
export async function getCachedPageContent(slug: string) {
  const now = Date.now();
  const cacheKey = `page:${slug}`;
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  try {
    const page = await prisma.pageContent.findUnique({
      where: { slug },
    });

    memoryCache.set(cacheKey, {
      data: page,
      expiry: now + DEFAULT_TTL_MS,
    });

    return page;
  } catch (error) {
    console.error(`Error querying pageContent for [${slug}]:`, error);
    return null;
  }
}

/**
 * High-performance cached query for Page Visibility Map
 */
export async function getCachedVisibility() {
  const now = Date.now();
  const cacheKey = "pages:visibility";
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  try {
    const pages = await prisma.pageContent.findMany({
      select: {
        slug: true,
        pageName: true,
        isPublished: true,
      },
    });

    const visibilityMap: Record<string, boolean> = {};
    pages.forEach((p) => {
      visibilityMap[p.slug] = p.isPublished;
    });

    const result = { visibility: visibilityMap, pages };

    memoryCache.set(cacheKey, {
      data: result,
      expiry: now + DEFAULT_TTL_MS,
    });

    return result;
  } catch (error) {
    console.error("Error querying pages visibility:", error);
    return { visibility: {}, pages: [] };
  }
}

/**
 * Instant cache invalidation triggered whenever an admin saves a page
 */
export function invalidatePageCache(slug?: string) {
  if (slug) {
    memoryCache.delete(`page:${slug}`);
  } else {
    for (const key of memoryCache.keys()) {
      if (key.startsWith("page:")) {
        memoryCache.delete(key);
      }
    }
  }
  memoryCache.delete("pages:visibility");
}
