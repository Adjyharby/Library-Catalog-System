import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "./AdminLib.css"; // Reuse the same CSS for consistency
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import { IconSearch, IconTrash, IconEdit } from "@tabler/icons-react";

export default function Accounts() {
  const currentUser = { Name: "librarian" }; // Hardcoded for now, adjust as needed
  const isLibrarian = currentUser.Name.toLowerCase() === "librarian";

  const [accounts, setAccounts] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 6;
  const pages = Math.ceil(accounts.length / rowsPerPage);

  // Form state for Add/Edit Account modal
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [editAdminID, setEditAdminID] = useState(null);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const response = await axios.get("http://localhost/API/admin.php", {
        params: { currentUser: currentUser.Name },
      });
      setAccounts(response.data || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    }
  };

  // Fetch accounts based on search query
  const handleSearch = async () => {
    if (!searchQuery) {
      fetchAccounts();
      return;
    }
    try {
      const response = await axios.get("http://localhost/API/admin.php", {
        params: { q: searchQuery, currentUser: currentUser.Name },
      });
      setAccounts(response.data || []);
      setPage(1); // Reset pagination
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return accounts.slice(start, end);
  }, [page, accounts]);

  const handleSelectionChange = (key) => {
    setSelectedKey(key);
  };

  // Form validation
  const isFormValid = name && password;

  // Handle Add Account submission
  const handleAddAccount = async () => {
    const newAccount = {
      Name: name,
      Password: password,
      currentUser: currentUser.Name,
    };
    try {
      const response = await axios.post(
        `http://localhost/API/admin.php?currentUser=${currentUser.Name}`,
        newAccount
      );
      if (!response.data.error) {
        fetchAccounts();
        resetForm();
        setIsModalOpen(false);
      } else {
        console.error("Error adding account:", response.data.error);
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error adding account:", error);
      alert("An error occurred while adding the account.");
    }
  };

  // Handle Edit Account submission
  const handleEditAccount = async () => {
    const updatedAccount = {
      AdminID: editAdminID,
      Name: name,
      Password: password,
      currentUser: currentUser.Name,
    };
    try {
      const response = await axios.put("http://localhost/API/admin.php", updatedAccount);
      if (!response.data.error) {
        fetchAccounts();
        resetForm();
        setIsModalOpen(false);
        setIsEditing(false);
        setEditAdminID(null);
      } else {
        console.error("Error editing account:", response.data.error);
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error editing account:", error);
      alert("An error occurred while editing the account.");
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async (adminID) => {
    if (!window.confirm(`Are you sure you want to delete account with ID ${adminID}?`)) return;
    try {
      await axios.delete("http://localhost/API/admin.php", {
        params: { AdminID: adminID, currentUser: currentUser.Name },
      });
      fetchAccounts();
      if (selectedKey === adminID) setSelectedKey(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(error.response?.data?.error || "An error occurred while deleting the account.");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setPassword("");
  };

  // Open modal for editing
  const openEditModal = (adminID) => {
    const accountToEdit = accounts.find((account) => account.AdminID === adminID);
    if (accountToEdit) {
      setName(accountToEdit.Name);
      setPassword(accountToEdit.Password);
      setEditAdminID(adminID);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="wrapper">
      <div className="header">
        <div className="title-container">
          <div className="text-group">
            <h1 className="title">Admin Accounts</h1>
            <p className="description">
              Manage admin accounts: add, edit, or remove accounts efficiently.
            </p>
          </div>
          {isLibrarian && (
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
                Add Account
              </Button>
            </div>
          )}
        </div>
        <div className="search-container">
          <Input
            placeholder="Search accounts by name..."
            startContent={<IconSearch size={20} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="search-input"
            isClearable
            onClear={() => {
              setSearchQuery("");
              fetchAccounts();
            }}
          />
          <Button color="primary" className="search-btn" onPress={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      <div className="table-container">
        <Table
          aria-label="Admin accounts table"
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
            <TableColumn key="AdminID">ID</TableColumn>
            <TableColumn key="Name">NAME</TableColumn>
            <TableColumn key="Password">PASSWORD</TableColumn>
            {isLibrarian && <TableColumn key="options" width="100">ACTIONS</TableColumn>}
          </TableHeader>
          <TableBody items={paginatedItems}>
            {(account) => (
              <TableRow
                key={account.AdminID}
                data-selected={selectedKey === account.AdminID ? "true" : undefined}
                onClick={() => setSelectedKey(account.AdminID)}
                className={`table-row ${
                  selectedKey === account.AdminID ? "table-row-selected" : "table-row-hover"
                }`}
              >
                {(columnKey) => (
                  <TableCell className="table-cell">
                    {columnKey === "options" && isLibrarian ? (
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          onPress={() => openEditModal(account.AdminID)}
                          disabled={account.Name.toLowerCase() === "librarian"} // Disable edit for librarian
                        >
                          <IconEdit size={20} />
                        </Button>
                        {account.Name.toLowerCase() !== "librarian" && (
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            color="danger"
                            onPress={() => handleDeleteAccount(account.AdminID)}
                          >
                            <IconTrash size={20} />
                          </Button>
                        )}
                      </div>
                    ) : columnKey === "Password" ? (
                      isLibrarian || account.Name === currentUser.Name
                        ? account.Password
                        : "******"
                    ) : (
                      account[columnKey] || "N/A"
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Account Modal */}
      {isLibrarian && (
        <Modal backdrop="blur" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
          <ModalContent className="bg-gray-200 p-6 rounded-lg shadow-lg">
            <>
              <ModalHeader className="text-2xl font-semibold">
                {isEditing ? "Edit Account" : "Add New Account"}
              </ModalHeader>
              <ModalBody className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-2">Account Information</h2>
                  <Input
                    isRequired
                    type="text"
                    label="Name"
                    placeholder="Enter account name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4"
                    isDisabled={isEditing && name.toLowerCase() === "librarian"} // Prevent editing librarian name
                  />
                  <Input
                    isRequired
                    type="password"
                    label="Password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  onPress={isEditing ? handleEditAccount : handleAddAccount}
                  disabled={!isFormValid}
                  className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}