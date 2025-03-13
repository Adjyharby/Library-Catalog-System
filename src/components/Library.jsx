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
  const [activeGenre, setActiveGenre] = useState(null);
  const [genreResults, setGenreResults] = useState([]);
  const [genreModalOpen, setGenreModalOpen] = useState(false);

  const searchInputRef = useRef(null);

  // Define all available genres
  const genres = [
    "Adventure", "Romance", "Comedy", "Drama", "Sci-Fi", "Fantasy", 
    "Mystery", "Thriller", "Horror", "Biography", "History", "Self-Help", 
    "Poetry", "Science", "Travel", "Cooking"
  ];

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

  // Fetch books by genre
  const fetchBooksByGenre = async (genre) => {
    setLoading(true);
    setActiveGenre(genre);
    try {
      const response = await axios.get(
        `http://localhost/API/Catalog.php?genre=${encodeURIComponent(genre)}`
      );
      console.log("Genre response:", response.data);
      setGenreResults(response.data || []);
      setGenreModalOpen(true);
    } catch (error) {
      console.error(`Error fetching ${genre} books:`, error);
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
    <div className="w-full min-h-screen p-4 overflow-auto" style={{alignItems: 'center', justifyContent: 'center', paddingTop: '0px'}}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="scroll-m-20 text-5xl lg:text-7xl font-extrabold tracking-tight mt-4 sm:mb-0">
          Library
        </h1>
        <Button onPress={handleModalOpen} className="min-w-[850px] h-10 mr-4">
          <IconSearch />
          Tap to search....
        </Button>
      </div>

      {/* Search Modal */}
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

      {/* Categories - Horizontally Scrollable */}
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      <div className="relative w-full mb-4">
        <div className="flex overflow-x-auto pb-4 hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
          {genres.map((genre, index) => (
            <div key={index} className="flex-none w-[180px] mr-4" style={{ scrollSnapAlign: 'start' }}>
              <Card 
                className="w-full h-[180px] relative"
                isPressable
                onPress={() => fetchBooksByGenre(genre)}
              >
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
            </div>
          ))}
        </div>
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      {/* Recommendations */}
      <h3 className="text-lg font-semibold mb-0" style={{ marginBottom: "0px" }}>
        Recommendations
      </h3>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-4 mt-0"
        style={{ marginTop: "0px" }}
      >
        {recommendations.map((book, index) => (
          <RecommendationCard key={index} book={book} onOpen={openBookModal} />
        ))}
      </div>

      {/* Book Detail Modal */}
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

      {/* Genre Results Modal */}
      <Modal
        isOpen={genreModalOpen}
        onOpenChange={setGenreModalOpen}
        backdrop="opaque"
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{activeGenre} Books</ModalHeader>
              <ModalBody>
                {genreResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {genreResults.map((book, index) => (
                      <Card
                        key={book.CatalogID || index}
                        className="w-full"
                        isPressable
                        onPress={() =>
                          openBookModal({
                            title: book["Book Name"],
                            author: book.AuthorName,
                            genre: book.Genre,
                            description:
                              book["ShortDesc"] || "No description available.",
                            img:
                              book["ImageDir"] && book["ImageDir"].trim() !== ""
                                ? book["ImageDir"]
                                : "placeholder.jpg",
                          })
                        }
                      >
                        <CardHeader className="flex flex-row items-center justify-start w-full">
                          <Image
                            src={
                              book["ImageDir"] && book["ImageDir"].trim() !== ""
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
                              <strong>
                                {book["Book Name"]} by {book.AuthorName}
                              </strong>
                            </div>
                            <p className="text-sm mt-1">
                              {book["ShortDesc"]
                                ? book["ShortDesc"].substring(0, 100) + "..."
                                : "No description available."}
                            </p>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No books found in this category.</p>
                )}
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

      <RandomNumberComponent onFetchBookName={handleFetchBookName} />
    </div>
  );
}

export default Library;