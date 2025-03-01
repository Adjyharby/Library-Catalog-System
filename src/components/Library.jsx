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

  // Fetch exactly 8 random books for recommendations
  const handleFetchBookName = () => {
    const fetchMultipleBooks = async () => {
      const promises = Array.from({ length: 8 }, () => {
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
          // Use the ImageDir column if available; otherwise use a placeholder.
          img:
            book["ImageDir"] && book["ImageDir"].trim() !== ""
              ? book["ImageDir"]
              : "placeholder.jpg",
        }));

      // Set recommendations to exactly these 8 books
      setRecommendations(validBooks);
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
      console.log("Search response:", response.data);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal with a book's details.
  const openBookModal = (book) => {
    console.log("Book modal opened with:", book);
    setSelectedBook(book);
    setBookOpen(true);
  };

  const handleModalOpen = () => {
    setRegistrationOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
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
                  <div className="w-full px-4">
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

                    <div className="mt-4 w-full">
                      {searchResults.length > 0 ? (
                        searchResults.map((book, index) => (
                          <Card
                            key={book.CatalogID || index}
                            className="w-full mb-4"
                            isPressable
                            onPress={() =>
                              openBookModal({
                                title: book["Book Name"],
                                author: book.AuthorName,
                                genre: book.Genre,
                                description:
                                  book["ShortDesc"] ||
                                  "No description available.",
                                img:
                                  book["ImageDir"] &&
                                  book["ImageDir"].trim() !== ""
                                    ? book["ImageDir"]
                                    : "placeholder.jpg",
                              })
                            }
                          >
                            <CardHeader className="flex flex-row items-center justify-start w-full">
                              <Image
                                src={
                                  book["ImageDir"] &&
                                  book["ImageDir"].trim() !== ""
                                    ? book["ImageDir"]
                                    : "placeholder.jpg"
                                }
                                alt={book["Book Name"]}
                                width={75}
                                height={75}
                                className="object-contain"
                              />
                              <div className="flex flex-col justify-center ml-4 text-left">
                                <div className="flex items-center">
                                  <small className="capitalize">
                                    {book.Genre || "Uncategorized"}
                                  </small>
                                  <span className="mx-2">|</span>
                                  <strong>
                                    {book["Book Name"]} by {book.AuthorName}
                                  </strong>
                                </div>
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
              src="book-bg.jpg" // Replace with actual image URLs later
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
                  className="mb-4 object-contain"
                  width={300}
                  height={300}
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
