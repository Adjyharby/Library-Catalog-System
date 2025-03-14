import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function RandomNumberComponent({ onFetchBookData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookData = () => {
    setLoading(true);
    setError(null);

    const promises = Array.from({ length: 8 }, () => {
      const randomId = Math.floor(Math.random() * 1934) + 1; // Adjust range based on your API
      return fetch(`http://localhost/API/Catalog.php?CatalogID=${randomId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error fetching book data:", error);
          return null; // Return null for failed fetches
        });
    });

    Promise.all(promises)
      .then((results) => {
        const mappedData = results
          .filter((data) => data && data["Book Name"]) // Filter out failed/null responses
          .map((data) => ({
            title: data["Book Name"] || "",
            author: data["Author"] || "", // Note: API uses "Author" here, not "AuthorName"
            genre: data["Genre"] || "",
            description: data["Description"] || "", // Note: API uses "Description", not "ShortDesc"
            publicationYear: data["Publication Year"] || "",
            img: data["Image URL"] || "/placeholder.jpg", // Adjust based on your API
          }));
        if (onFetchBookData && mappedData.length > 0) {
          onFetchBookData(mappedData); // Pass array of books
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setError("Failed to fetch book data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookData();
  }, []); // Run once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null; // No UI, just triggers fetch
}

RandomNumberComponent.propTypes = {
  onFetchBookData: PropTypes.func.isRequired,
};

export default RandomNumberComponent;