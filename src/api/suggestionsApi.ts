export const fetchSuggestions = (query: string): Promise<string[]> => {
    const allSuggestions = [
      "test",
      "hello",
      "world",
      "draft-js",
      "hello world",
      "draft-js example",
    ];
  
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = allSuggestions.filter((s) =>
          s.toLowerCase().startsWith(query.toLowerCase())
        );
        resolve(filtered);
      }, 500);
    });
  };