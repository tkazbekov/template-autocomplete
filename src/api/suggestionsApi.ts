import { words } from "./mock";
export const fetchSuggestions = (query: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = (words as string[]).filter((s) =>
        s.toLowerCase().startsWith(query.toLowerCase())
      ).slice(0, 3);
      resolve(filtered);
    }, 500);
  });
};
