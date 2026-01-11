import { useEffect } from "react";

/**
 * Custom Hook: useTitle
 * Dynamically updates the browser tab title based on the provided string.
 * @param {string} title - The specific title for the current page.
 */
const useTitle = (title) => {
  useEffect(() => {
    // Set the document title with a consistent branding suffix
    document.title = `${title} | ProManager`;
  }, [title]); // Re-run the effect whenever the title variable changes
};

export default useTitle;
