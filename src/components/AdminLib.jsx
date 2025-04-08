import React, { useState, useMemo, useEffect } from "react";
import "./AdminLib.css";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { IconSearch, IconTrash, IconEdit } from "@tabler/icons-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 6;
  const pages = Math.ceil(items.length / rowsPerPage);

  // Form state for Add/Edit Book modal
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [type, setType] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [imageDir, setImageDir] = useState("");
  const [status, setStatus] = useState("Available");
  const [publisherName, setPublisherName] = useState("");
  const [dateOfPublish, setDateOfPublish] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [ssid, setSsid] = useState("");
  const [editCatalogID, setEditCatalogID] = useState(null);

  // Autocomplete options for Status
  const statusOptions = [
    { key: "Available", label: "Available" },
    { key: "Unavailable", label: "Unavailable" },
  ];

  // Fetch all books (called on mount or when search is cleared)
  const fetchAllBooks = async () => {
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

  // Fetch books based on search query
  const handleSearch = async () => {
    if (!searchQuery) {
      fetchAllBooks();
      return;
    }
    try {
      const response = await fetch(
        `http://localhost/API/Catalog.php?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Search network response was not ok");
      const data = await response.json();
      setItems(data || []);
      setPage(1); // reset pagination
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, items]);

  const handleSelectionChange = (key) => {
    setSelectedKey(key);
  };

  const formatShortDesc = (desc) => {
    return desc && desc.length > 50 ? desc.substring(0, 50) + "..." : desc || "N/A";
  };

  const isFormValid = bookName && authorName && type && shortDesc;

  // Handle Add Book submission
  const handleAddBook = async () => {
    const newBook = {
      "Book Name": bookName,
      AuthorName: authorName,
      Type: type,
      ShortDesc: shortDesc,
      ImageDir: imageDir,
      Status: status,
      PublisherName: publisherName,
      DateOfPublish: dateOfPublish || "0000-00-00",
      Quantity: quantity,
      SSID: ssid,
      DateModified: new Date().toISOString().slice(0, 19).replace("T", " "),
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
      Type: type,
      ShortDesc: shortDesc,
      ImageDir: imageDir,
      Status: status,
      PublisherName: publisherName,
      DateOfPublish: dateOfPublish || "0000-00-00",
      Quantity: quantity,
      SSID: ssid,
      DateModified: new Date().toISOString().slice(0, 19).replace("T", " "),
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

  // Handle Delete Book with headers removed for DELETE request
  const handleDeleteBook = async (catalogID) => {
    if (!window.confirm(`Are you sure you want to delete book with ID ${catalogID}?`))
      return;
  
    try {
      // Notice: We do not pass Content-Type header here.
      const response = await fetch(`http://localhost/API/Catalog.php?CatalogID=${catalogID}`, {
        method: "DELETE"
      });
      let result = {};
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("No JSON response on delete, status:", response.status);
      }
  
      if (result.success) {
        setItems((prevItems) => prevItems.filter((item) => item.CatalogID !== catalogID));
        if (selectedKey === catalogID) setSelectedKey(null);
      } else {
        console.error("Error deleting book:", result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setBookName("");
    setAuthorName("");
    setType("");
    setShortDesc("");
    setImageDir("");
    setStatus("Available");
    setPublisherName("");
    setDateOfPublish("");
    setQuantity(1);
    setSsid("");
  };

  // Open modal for editing
  const openEditModal = (catalogID) => {
    const bookToEdit = items.find((item) => item.CatalogID === catalogID);
    if (bookToEdit) {
      setBookName(bookToEdit["Book Name"]);
      setAuthorName(bookToEdit.AuthorName);
      setType(bookToEdit.Type);
      setShortDesc(bookToEdit.ShortDesc);
      setImageDir(bookToEdit.ImageDir || "");
      setStatus(bookToEdit.Status || "Available");
      setPublisherName(bookToEdit.PublisherName || "");
      setDateOfPublish(bookToEdit.DateOfPublish || "");
      setQuantity(bookToEdit.Quantity || 1);
      setSsid(bookToEdit.SSID || "");
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
        {/* Search Input */}
        <div className="search-container">
          <Input
            placeholder="Search books, authors, or types..."
            startContent={<IconSearch size={20} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="search-input"
            isClearable
            onClear={() => {
              setSearchQuery("");
              fetchAllBooks();
            }}
          />
          <Button color="primary" className="search-btn" onPress={handleSearch}>
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
            <TableColumn key="CatalogID">ID</TableColumn>
            <TableColumn key="Book Name">TITLE</TableColumn>
            <TableColumn key="AuthorName">AUTHOR</TableColumn>
            <TableColumn key="Type">TYPE</TableColumn>
            <TableColumn key="ShortDesc">DESCRIPTION</TableColumn>
            <TableColumn key="Status">STATUS</TableColumn>
            <TableColumn key="Quantity">QUANTITY</TableColumn>
            <TableColumn key="PublisherName">PUBLISHER</TableColumn>
            <TableColumn key="DateOfPublish">DATE PUBLISHED</TableColumn>
            <TableColumn key="SSID">SSID</TableColumn>
            <TableColumn key="DateModified">DATE MODIFIED</TableColumn>
            <TableColumn key="options" width="50"></TableColumn>
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
                {(columnKey) => {
                  if (columnKey === "options") {
                    return (
                      <TableCell>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onPress={() => openEditModal(item.CatalogID)}
                          >
                            <IconEdit size={20} />
                          </Button>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            color="danger"
                            onPress={() => handleDeleteBook(item.CatalogID)}
                          >
                            <IconTrash size={20} />
                          </Button>
                        </div>
                      </TableCell>
                    );
                  } else if (columnKey === "ShortDesc") {
                    return <TableCell>{formatShortDesc(item[columnKey])}</TableCell>;
                  } else {
                    return (
                      <TableCell>
                        {item[columnKey] !== undefined && item[columnKey] !== "" ? item[columnKey] : "N/A"}
                      </TableCell>
                    );
                  }
                }}
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
                  label="Type"
                  placeholder="Enter book type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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
                    label="Status"
                    placeholder="Select status"
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
                  <Input
                    type="number"
                    label="Quantity"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  />
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
                <Input
                  type="text"
                  label="SSID"
                  placeholder="Enter SSID (if applicable)"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="w-full mb-4"
                />
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
