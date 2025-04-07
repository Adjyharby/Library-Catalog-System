import React, { useState, useMemo, useEffect } from "react";
import "./AdminLib.css";
import { Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { IconSearch, IconDotsVertical } from "@tabler/icons-react";
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
  const rowsPerPage = 6;
  const pages = Math.ceil(items.length / rowsPerPage);

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
    console.log("Selected book:", key);
  };

  const formatGenres = (genreString) => {
    if (!genreString) return "N/A";
    const genres = genreString.split(/,\s*/);
    return genres.length > 1 ? genres.join(", ") : genres[0];
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
            <TableColumn className="table-header" key="NameOfAuthor">AUTHOR</TableColumn>
            <TableColumn className="table-header" key="Genre">GENRE</TableColumn>
            <TableColumn className="table-header" key="ShortDesc">DESCRIPTION</TableColumn>
            <TableColumn className="table-header" key="Status">STATUS</TableColumn>
            <TableColumn className="table-header" key="PublisherName">PUBLISHER</TableColumn>
            <TableColumn className="table-header" key="DateOfPublish">DATE PUBLISHED</TableColumn>
            <TableColumn className="table-header" key="options" width="50"> </TableColumn>
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
                            onPress={() => console.log("Edit", item.CatalogID)}
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            onPress={() => console.log("Delete", item.CatalogID)}
                          >
                            Delete
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
    </div>
  );
}