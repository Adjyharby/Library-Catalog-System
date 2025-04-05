import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function RandomNumberComponent({ onFetchBookData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookData = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, fetch the total number of books dynamically
      const countResponse = await fetch("http://localhost/API/CatalogCount.php");
      if (!countResponse.ok) {
        throw new Error("Failed to fetch total book count");
      }
      const countData = await countResponse.json();
      const totalBooks = countData.total;
      
      // Generate promises using the dynamic totalBooks
      const promises = Array.from({ length: 8 }, () => {
        const randomId = Math.floor(Math.random() * totalBooks) + 1;
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
              author: data["Author"] || "",
              genre: data["Genre"] || "",
              description: data["Description"] || "",
              publicationYear: data["Publication Year"] || "",
              img: data["Image URL"] || "/placeholder.jpg",
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
    } catch (error) {
      console.error("Error fetching total count:", error);
      setError("Failed to fetch total book count");
      setLoading(false);
    }
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
