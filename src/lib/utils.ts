import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCollection, type CollectionEntry } from "astro:content";


export type BlogPostType = CollectionEntry<"blog">;

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

export function getRelatedPosts(posts: BlogPostType[], currentPost: BlogPostType, limit = 3) {
  return posts
    .filter(post => post.id !== currentPost.id) // Exclude the current post
    .map(post => {
      const categoryMatch = post.data.category === currentPost.data.category;
      const tagMatches = post.data.tags?.filter(tag => currentPost.data.tags?.includes(tag)) || [];
      const tagMatchCount = tagMatches.length;

      return { post, categoryMatch, tagMatchCount };
    })
    .sort((a, b) => {
      // Priority 1: Category + Tags match (sorted by tag match count)
      if (a.categoryMatch && b.categoryMatch) {
        return b.tagMatchCount - a.tagMatchCount; // More tag matches come first
      }
      // Priority 2: Tags match only (sorted by tag match count)
      if (a.categoryMatch !== b.categoryMatch) {
        return a.categoryMatch ? -1 : 1; // Prioritize category matches
      }
      return b.tagMatchCount - a.tagMatchCount; // Sort by tag matches
    })
    .slice(0, limit) // Limit the number of related posts
    .map(entry => entry.post); // Return only the posts
}