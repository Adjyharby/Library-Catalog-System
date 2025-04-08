import React, { useState, useMemo, useEffect } from "react";
import "./AdminLib.css";
import {
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { IconSearch, IconDotsVertical, IconTrash, IconEdit } from "@tabler/icons-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";

export default function AdminLib() {
  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing
  const rowsPerPage = 6;
  const pages = Math.ceil(items.length / rowsPerPage);

  // Form state for Add/Edit Book modal
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [genre, setGenre] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [imageDir, setImageDir] = useState("");
  const [status, setStatus] = useState("Available");
  const [publisherName, setPublisherName] = useState("");
  const [dateOfPublish, setDateOfPublish] = useState("");
  const [editCatalogID, setEditCatalogID] = useState(null); // Store the ID being edited

  // Autocomplete options
  const genreOptions = [
    { key: "Fiction", label: "Fiction" },
    { key: "Non-Fiction", label: "Non-Fiction" },
    { key: "Mystery", label: "Mystery" },
    { key: "Fantasy", label: "Fantasy" },
    { key: "Science Fiction", label: "Science Fiction" },
  ];
  const statusOptions = [
    { key: "Available", label: "Available" },
    { key: "Unavailable", label: "Unavailable" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost/API/Catalog.php");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setItems([]);
      }
    };
    fetchBooks();
  }, []);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, items]);

  const handleSelectionChange = (key) => {
    setSelectedKey(key);
  };

  const formatGenres = (genreString) => {
    if (!genreString) return "N/A";
    const genres = genreString.split(/,\s*/);
    return genres.length > 1 ? genres.join(", ") : genres[0];
  };

  // Form validation
  const isFormValid = bookName && authorName && genre && shortDesc;

  // Handle Add Book submission
  const handleAddBook = async () => {
    const newBook = {
      "Book Name": bookName,
      AuthorName: authorName,
      Genre: genre,
      ShortDesc: shortDesc,
      ImageDir: imageDir,
      Status: status,
      PublisherName: publisherName,
      DateOfPublish: dateOfPublish || "0000-00-00",
      Quantity: 1,
      AdminID: 1,
    };

    try {
      const response = await fetch("http://localhost/API/Catalog.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      const result = await response.json();
      if (result.success) {
        setItems((prevItems) => [
          { CatalogID: result.CatalogID, ...newBook },
          ...prevItems,
        ]);
        resetForm();
        setIsModalOpen(false);
      } else {
        console.error("Error adding book:", result.error);
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // Handle Edit Book submission
  const handleEditBook = async () => {
    const updatedBook = {
      CatalogID: editCatalogID,
      "Book Name": bookName,
      AuthorName: authorName,
      Genre: genre,
      ShortDesc: shortDesc,
      ImageDir: imageDir,
      Status: status,
      PublisherName: publisherName,
      DateOfPublish: dateOfPublish || "0000-00-00",
      Quantity: 1,
      AdminID: 1,
    };

    try {
      const response = await fetch("http://localhost/API/Catalog.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });
      const result = await response.json();
      if (result.success) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.CatalogID === editCatalogID ? { ...item, ...updatedBook } : item
          )
        );
        resetForm();
        setIsModalOpen(false);
        setIsEditing(false);
        setEditCatalogID(null);
      } else {
        console.error("Error editing book:", result.error);
      }
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  // Handle Delete Book
  const handleDeleteBook = async (catalogID) => {
    if (!window.confirm(`Are you sure you want to delete book with ID ${catalogID}?`)) return;
  
    try {
      console.log(`Sending DELETE request for CatalogID: ${catalogID}`);
      const response = await fetch(`http://localhost/API/Catalog.php?CatalogID=${catalogID}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      console.log("Delete response:", result);
  
      if (result.success) {
        setItems((prevItems) => prevItems.filter((item) => item.CatalogID !== catalogID));
        if (selectedKey === catalogID) setSelectedKey(null);
        console.log(`Book with CatalogID ${catalogID} deleted successfully`);
      } else {
        console.error("Server returned error:", result.error);
      }
    } catch (error) {
      console.error("Fetch error during delete:", error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setBookName("");
    setAuthorName("");
    setGenre("");
    setShortDesc("");
    setImageDir("");
    setStatus("Available");
    setPublisherName("");
    setDateOfPublish("");
  };

  // Open modal for editing
  const openEditModal = (catalogID) => {
    const bookToEdit = items.find((item) => item.CatalogID === catalogID);
    if (bookToEdit) {
      setBookName(bookToEdit["Book Name"]);
      setAuthorName(bookToEdit.AuthorName);
      setGenre(bookToEdit.Genre);
      setShortDesc(bookToEdit.ShortDesc);
      setImageDir(bookToEdit.ImageDir || "");
      setStatus(bookToEdit.Status || "Available");
      setPublisherName(bookToEdit.PublisherName || "");
      setDateOfPublish(bookToEdit.DateOfPublish || "");
      setEditCatalogID(catalogID);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="wrapper">
      <div className="header">
        <div className="title-container">
          <div className="text-group">
            <h1 className="title">Catalog Management</h1>
            <p className="description">
              Manage the library catalog: add, edit, or remove books efficiently.
            </p>
          </div>
          <div className="button-group">
            <Button
              variant="flat"
              color="warning"
              onPress={() => {
                resetForm();
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="register-btn"
            >
              Add Book
            </Button>
          </div>
        </div>
        <div className="search-container">
          <Input
            placeholder="Search books, authors, or genres..."
            startContent={<IconSearch size={20} />}
            className="search-input"
          />
          <Button
            color="primary"
            className="search-btn"
            onPress={() => console.log("Search clicked")}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="table-container">
        <Table
          aria-label="Catalog management table"
          onSelectionChange={handleSelectionChange}
          selectionMode="single"
          showSelectionCheckboxes
          bottomContent={
            <div className="pagination-container">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={setPage}
              />
            </div>
          }
          className="catalog-table"
        >
          <TableHeader>
            <TableColumn className="table-header" key="CatalogID">
              ID
            </TableColumn>
            <TableColumn className="table-header" key="Book Name">
              TITLE
            </TableColumn>
            <TableColumn className="table-header" key="AuthorName">
              AUTHOR
            </TableColumn>
            <TableColumn className="table-header" key="Genre">
              GENRE
            </TableColumn>
            <TableColumn className="table-header" key="ShortDesc">
              DESCRIPTION
            </TableColumn>
            <TableColumn className="table-header" key="Status">
              STATUS
            </TableColumn>
            <TableColumn className="table-header" key="PublisherName">
              PUBLISHER
            </TableColumn>
            <TableColumn className="table-header" key="DateOfPublish">
              DATE PUBLISHED
            </TableColumn>
            <TableColumn className="table-header" key="options" width="50">
              {" "}
            </TableColumn>
          </TableHeader>
          <TableBody items={paginatedItems}>
            {(item) => (
              <TableRow
                key={item.CatalogID}
                data-selected={selectedKey === item.CatalogID ? "true" : undefined}
                onClick={() => setSelectedKey(item.CatalogID)}
                className={`table-row ${
                  selectedKey === item.CatalogID ? "table-row-selected" : "table-row-hover"
                }`}
              >
                {(columnKey) => (
                  <TableCell className="table-cell">
                    {columnKey === "options" ? (
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="light" size="sm">
                            <IconDotsVertical size={20} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Book actions">
                          <DropdownItem
                            key="edit"
                            onPress={() => openEditModal(item.CatalogID)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <IconEdit size={20} />
                              Edit
                            </div>
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            onPress={() => handleDeleteBook(item.CatalogID)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <IconTrash size={20} />
                              Delete
                            </div>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    ) : columnKey === "Genre" ? (
                      formatGenres(item[columnKey])
                    ) : columnKey === "ShortDesc" ? (
                      item[columnKey]?.substring(0, 50) + "..." || "N/A"
                    ) : (
                      item[columnKey] || "N/A"
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Book Modal */}
      <Modal backdrop="blur" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="2xl">
        <ModalContent className="bg-gray-200 p-6 rounded-lg shadow-lg">
          <>
            <ModalHeader className="text-2xl font-semibold">
              {isEditing ? "Edit Book" : "Add New Book"}
            </ModalHeader>
            <ModalBody className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Book Information</h2>
                <Input
                  isRequired
                  type="text"
                  label="Book Title"
                  placeholder="Enter book title"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="w-full mb-4"
                />
                <Input
                  isRequired
                  type="text"
                  label="Author Name"
                  placeholder="Enter author name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full mb-4"
                />
                <Input
                  isRequired
                  type="text"
                  label="Description"
                  placeholder="Enter short description"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full mb-4"
                />
                <Input
                  type="text"
                  label="Image URL"
                  placeholder="Enter image URL (optional)"
                  value={imageDir}
                  onChange={(e) => setImageDir(e.target.value)}
                  className="w-full mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Autocomplete
                    isRequired
                    label="Genre"
                    placeholder="Select or type genre"
                    value={genre}
                    onInputChange={setGenre}
                    defaultItems={genreOptions}
                    allowsCustomValue={true}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.key} value={item.key}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <Autocomplete
                    label="Status"
                    placeholder="Select or type status"
                    value={status}
                    onInputChange={setStatus}
                    defaultItems={statusOptions}
                    allowsCustomValue={true}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.key} value={item.key}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    type="text"
                    label="Publisher Name"
                    placeholder="Enter publisher name"
                    value={publisherName}
                    onChange={(e) => setPublisherName(e.target.value)}
                  />
                  <Input
                    type="date"
                    label="Date of Publish"
                    placeholder="Select publish date"
                    value={dateOfPublish}
                    onChange={(e) => setDateOfPublish(e.target.value)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end space-x-3">
              <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={isEditing ? handleEditBook : handleAddBook}
                disabled={!isFormValid}
                className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}