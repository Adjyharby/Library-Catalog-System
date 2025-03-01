import { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  Image,
} from "@nextui-org/react";
import axios from "axios";
import "./library.css";
import { IconSearch } from "@tabler/icons-react";
import RecommendationCard from "./RecommendationCard.jsx";
import RandomNumberComponent from "./RecommendRandom.jsx";

function Library() {
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [isBookOpen, setBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const searchInputRef = useRef(null);

  // Fetch data from API on load
  useEffect(() => {
    handleFetchBookName(); // Fetch initial recommendations on component mount
  }, []);

  // Fetch multiple random books for recommendations
  const handleFetchBookName = () => {
    const fetchMultipleBooks = async () => {
      const promises = Array.from({ length: 4 }, () => {
        const randomId = Math.floor(Math.random() * 24) + 1;
        return fetch(`http://localhost/API/Catalog.php?CatalogID=${randomId}`)
          .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
          })
          .catch((error) => {
            console.error("Error fetching book data:", error);
            return null;
          });
      });

      const results = await Promise.all(promises);

      const validBooks = results
        .filter((book) => book && book["Book Name"])
        .map((book) => ({
          title: book["Book Name"] || "Unknown Title",
          author: book["AuthorName"] || "Unknown Author",
          genre: book["Genre"] || "Uncategorized",
          description: book["ShortDesc"] || "No description available.",
          img: `prof${Math.floor(Math.random() * 4) + 2}.jpg`,
        }));

      setRecommendations((prevRecommendations) => [
        ...prevRecommendations,
        ...validBooks,
      ]);
    };

    fetchMultipleBooks();
  };

  // Search books using query
  const fetchBooks = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost/API/Catalog.php?q=${encodeURIComponent(searchQuery)}`
      );
      // Log the response to inspect the data structure if needed
      console.log("Search response:", response.data);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => {
    setRegistrationOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
    setBookOpen(true);
  };

  return (
    <div className="p-2">
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl mb-2 mr-60">
          Library
        </h1>

        <Button onPress={handleModalOpen} className="min-w-96 h-10 -mt-1">
          <IconSearch />
          Tap to search....
        </Button>

        <Modal
          isOpen={isRegistrationOpen}
          onOpenChange={setRegistrationOpen}
          backdrop="opaque"
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Search for Books</ModalHeader>
                <ModalBody>
                  <div>
                    <Input
                      ref={searchInputRef}
                      classNames={{
                        base: "max-w-full sm:max-w-[10rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper:
                          "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                      }}
                      placeholder="Type to search..."
                      size="sm"
                      startContent={<IconSearch size={18} />}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          fetchBooks();
                        }
                      }}
                    />

                    <Button
                      onPress={fetchBooks}
                      className="mt-4"
                      isLoading={loading}
                    >
                      Search
                    </Button>

                    <div className="mt-4">
                      {searchResults.length > 0 ? (
                        searchResults.map((book, index) => (
                          <Card key={book.CatalogID || index} className="mb-4">
                            <CardHeader>
                              <Image
                                src={"placeholder.jpg"}
                                alt={book["Book Name"]}
                                width={50}
                                height={75}
                                className="mr-4"
                              />
                              <div>
                                <h4 className="text-lg font-bold z-90">
                                  {book["Book Name"]}
                                </h4>
                                <p className="text-sm">{book.AuthorName}</p>
                              </div>
                            </CardHeader>
                          </Card>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">
                          No results found.
                        </p>
                      )}
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* Category Content Section */}
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      <div className="category-content grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {["Adventure", "Horror", "Comedy", "Drama"].map((genre, index) => (
          <Card key={index} className="w-full h-[180px] relative">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
              <p className="text-xs text-white/60 uppercase font-bold">
                What to read
              </p>
              <h4 className="text-white font-medium text-sm">{genre}</h4>
            </CardHeader>
            <Image
              removeWrapper
              alt={`${genre} genre`}
              className="z-0 w-full h-full object-cover"
              src="book-bg.jpg" // Replace with actual image URLs
            />
          </Card>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((book, index) => (
          <RecommendationCard key={index} book={book} onOpen={openBookModal} />
        ))}
      </div>

      <Modal
        isOpen={isBookOpen}
        onOpenChange={setBookOpen}
        backdrop="opaque"
        size="1xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{selectedBook?.title}</ModalHeader>
              <ModalBody>
                <Image
                  src={selectedBook?.img}
                  alt="Book cover"
                  className="mb-4"
                />
                <p>
                  <strong>Author:</strong> {selectedBook?.author}
                </p>
                <p>
                  <strong>Genre:</strong> {selectedBook?.genre}
                </p>
                <p>
                  <strong>Description:</strong> {selectedBook?.description}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <RandomNumberComponent onFetchBookName={handleFetchBookName} />
    </div>
  );
}

export default Library;
