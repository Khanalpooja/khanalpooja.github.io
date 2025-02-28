import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCollection } from "astro:content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUniqueTags() {
    const posts = await getCollection("blog");

    const tagsSet = new Set<string>();
    posts.forEach(post => {
        post.data.tags?.forEach(tag => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
}