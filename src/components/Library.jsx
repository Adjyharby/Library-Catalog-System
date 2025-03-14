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
  CardBody,
  Image,
} from "@nextui-org/react";
import axios from "axios";
import "./library.css";
import { IconSearch, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Tooltip } from "@nextui-org/react";
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

  const scrollRef = useRef(null);
  const searchInputRef = useRef(null);

  const genres = [
    "Adventure", "Romance", "Comedy", "Drama", "Sci-Fi", "Fantasy",
    "Mystery", "Thriller", "Horror", "Biography", "History", "Self-Help",
    "Poetry", "Science", "Travel", "Cooking"
  ];

  useEffect(() => {
    handleFetchBookName();
  }, []);

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
          img: book["ImageDir"] && book["ImageDir"].trim() !== "" ? book["ImageDir"] : "/placeholder.jpg",
        }));

      setRecommendations(validBooks);
    };

    fetchMultipleBooks();
  };

  const fetchBooks = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost/API/Catalog.php?q=${encodeURIComponent(searchQuery)}`
      );
      console.log("Search response:", response.data);
      // Debug image paths
      response.data.forEach((book) => console.log("ImageDir:", book["ImageDir"]));
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -180, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 180, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen p-4 overflow-auto" style={{ alignItems: "center", justifyContent: "center", paddingTop: "0px" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row  mb-6 relative">
        <h1 className="scroll-m-20 text-5xl lg:text-7xl font-extrabold tracking-tight mt-4 sm:mb-0">
          Library
        </h1>
        <Tooltip content="Search Books" placement="bottom">
          <Button
            isIconOnly
            color="primary"
            size="lg"
            radius="full"
            onPress={handleModalOpen}
            className="fixed top-4 right-20 z-10 hover:scale-105 transition-transform"
          >
            <IconSearch size={24} />
          </Button>
        </Tooltip>
      </div>

      {/* Search Modal */}
      <Modal
        isOpen={isRegistrationOpen}
        onOpenChange={setRegistrationOpen}
        backdrop="opaque"
        size="2xl"
        className="rounded-lg"
      >
        <ModalContent className="bg-white shadow-lg">
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-semibold bg-gray-100 p-4 rounded-t-lg">
                Search for Books
              </ModalHeader>
              <ModalBody className="p-6">
                <div className="flex gap-2">
                  <Input
                    ref={searchInputRef}
                    size="lg"
                    placeholder="Search books, authors, or genres..."
                    startContent={<IconSearch size={20} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
                    className="w-full rounded-lg shadow-sm"
                    isClearable
                    onClear={() => setSearchQuery("")}
                  />
                  <Button
                    onPress={fetchBooks}
                    color="primary"
                    isLoading={loading}
                    size="lg"
                    className="rounded-lg"
                  >
                    Search
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((book, index) => (
                      <Card
                        key={book.CatalogID || index}
                        isPressable
                        onPress={() =>
                          openBookModal({
                            title: book["Book Name"],
                            author: book.AuthorName,
                            genre: book.Genre,
                            description: book["ShortDesc"] || "No description available.",
                            img: book["ImageDir"] && book["ImageDir"].trim() !== "" ? book["ImageDir"] : "/placeholder.jpg",
                          })
                        }
                        className="hover:shadow-md transition-shadow w-full"
                      >
                        <CardHeader className="flex items-center gap-4 p-4">
                          <Image
                            src={book["ImageDir"] && book["ImageDir"].trim() !== "" ? book["ImageDir"] : "/placeholder.jpg"}
                            alt={book["Book Name"] || "Book cover"}
                            width={80}
                            height={80}
                            className="object-contain rounded-md"
                          />
                          <div className="flex flex-col">
                            <p className="font-semibold text-lg">{book["Book Name"] || "Unknown Title"}</p>
                            <p className="text-sm text-gray-600">{book.AuthorName || "Unknown Author"}</p>
                          </div>
                        </CardHeader>
                        <CardBody className="p-4 pt-0">
                          <p className="text-sm text-gray-500">{book.Genre || "Uncategorized"}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            {book["ShortDesc"] ? book["ShortDesc"].substring(0, 100) + "..." : "No description available."}
                          </p>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full text-center">No results found.</p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-200 p-4">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Categories Section with Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Categories</h3>
        </div>
        <div className="relative w-full">
          <Button
            isIconOnly
            onPress={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300"
          >
            <IconChevronLeft size={24} />
          </Button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
          >
            {genres.map((genre, index) => (
              <div key={index} className="flex-none w-[180px] mr-4 snap-start">
                <Card
                  className="w-full h-[180px] relative hover:scale-105 transition-transform duration-200"
                  isPressable
                  onPress={() => fetchBooksByGenre(genre)}
                >
                  <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                    <p className="text-xs text-white/60 uppercase font-bold">What to read</p>
                    <h4 className="text-white font-medium text-sm">{genre}</h4>
                  </CardHeader>
                  <Image
                    removeWrapper
                    alt={`${genre} genre`}
                    className="z-0 w-full h-full object-cover"
                    src="book-bg.jpg"
                  />
                </Card>
              </div>
            ))}
          </div>
          <Button
            isIconOnly
            onPress={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300"
          >
            <IconChevronRight size={24} />
          </Button>
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .snap-x {
              scroll-snap-type: x mandatory;
            }
            .snap-start {
              scroll-snap-align: start;
            }
          `}</style>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
          {recommendations.map((book, index) => (
            <RecommendationCard
              key={index}
              book={book}
              onOpen={openBookModal}
              className="duration-200 hover:shadow-lg hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>

      {/* Book Detail Modal */}
      <Modal
        isOpen={isBookOpen}
        onOpenChange={setBookOpen}
        backdrop="opaque"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-2/5 bg-gradient-to-b from-purple-500 to-blue-500 p-6 flex items-center justify-center">
                    <Image
                      src={selectedBook?.img}
                      alt="Book cover"
                      className="object-contain max-h-64 shadow-xl rounded"
                      width={200}
                      height={300}
                    />
                  </div>
                  <div className="w-full md:w-3/5 p-6">
                    <h2 className="text-2xl font-bold mb-2">{selectedBook?.title}</h2>
                    <p className="text-gray-500 mb-4">by {selectedBook?.author}</p>
                    <div className="mb-4">
                      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                        {selectedBook?.genre}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">About this book</h3>
                    <p className="text-gray-700 mb-6">{selectedBook?.description}</p>
                    <div className="flex justify-end">
                      <Button color="primary" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
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
                            description: book["ShortDesc"] || "No description available.",
                            img: book["ImageDir"] && book["ImageDir"].trim() !== "" ? book["ImageDir"] : "/placeholder.jpg",
                          })
                        }
                      >
                        <CardHeader className="flex flex-row items-center justify-start w-full">
                          <Image
                            src={book["ImageDir"] || "/placeholder.jpg"}
                            alt={book["Book Name"]}
                            width={75}
                            height={75}
                            className="object-contain"
                          />
                          <div className="flex flex-col justify-center ml-4 text-left">
                            <div className="flex items-center">
                              <strong>{book["Book Name"]} by {book.AuthorName}</strong>
                            </div>
                            <p className="text-sm mt-1">
                              {book["ShortDesc"] ? book["ShortDesc"].substring(0, 100) + "..." : "No description available."}
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