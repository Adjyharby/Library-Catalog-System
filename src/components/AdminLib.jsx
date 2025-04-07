import React, { useState, useMemo, useEffect } from "react";
import "./AdminLib.css";
import { Button, Input } from "@nextui-org/react";
import { IconSearch } from "@tabler/icons-react";
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
  const [items, setItems] = useState([]); // Books from DB
  const [selectedKey, setSelectedKey] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const pages = Math.ceil(items.length / rowsPerPage);

  // Fetch all books from Catalog.php
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost/API/Catalog.php");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setItems([]); // Fallback to empty array on error
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
    console.log("Selected book:", key);
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
              onPress={() => console.log("Add book clicked")}
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
            <TableColumn className="table-header" key="CatalogID">ID</TableColumn>
            <TableColumn className="table-header" key="Book Name">TITLE</TableColumn>
            <TableColumn className="table-header" key="AuthorName">AUTHOR</TableColumn>
            <TableColumn className="table-header" key="Genre">GENRE</TableColumn>
            <TableColumn className="table-header" key="ShortDesc">DESCRIPTION</TableColumn>
            <TableColumn className="table-header" key="Actions">ACTIONS</TableColumn>
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
                    {columnKey === "Actions" ? (
                      <div className="action-buttons">
                        <Button
                          size="sm"
                          color="primary"
                          onPress={() => console.log("Edit", item.CatalogID)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onPress={() => console.log("Delete", item.CatalogID)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : columnKey === "ShortDesc" ? (
                      item[columnKey]?.substring(0, 50) + "..." || "N/A" // Truncate description
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
    </div>
  );
}