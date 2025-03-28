import { useState } from "react";
import { IconUserCog } from "@tabler/icons-react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import { MailIcon } from "./MailIcon.jsx";
import { LockIcon } from "./LockIcon.jsx";
import PropTypes from "prop-types";

function Sidebar({ onSelectPage }) {
  const [isAdminLoginOpen, setAdminLoginOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("Library");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    onSelectPage(page);
  };

  // Function to handle admin login
  const handleAdminLogin = async () => {
    setLoginError(""); // Clear any previous error

    try {
      const response = await fetch("http://localhost/API/Admin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (result.success) {
        // If login is successful, switch to the admin layout
        handleSelectPage("Admin");
        setAdminLoginOpen(false);
      } else {
        // If credentials don't match, show error
        setLoginError("Incorrect username or password, please try again.");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      setLoginError("An error occurred during login. Please try again later.");
    }
  };

  Sidebar.propTypes = {
    onSelectPage: PropTypes.func.isRequired,
  };

  return (
    <div className="sidebar">
      <div className="library-logo">
        <img src="/LibrarySystemLogo.png" alt="Library logo" />
      </div>
      <div className="logo">
        <img className="logo-pic" src="/BSC_logo.png" alt="College logo" />
      </div>

      <div className="buttons">
        <Button
          onClick={() => handleSelectPage("Library")}
          className={`functions ${selectedPage === "Library" ? "active" : ""} mb-6`}
        >
          <img src="/library.png" alt="Library icon" />
          <div className="components mr-7">Library</div>
        </Button>

        <Button
          onClick={() => handleSelectPage("Registration")}
          className={`functions ${selectedPage === "Registration" ? "active" : ""} mb-6`}
        >
          <img src="/registration.png" alt="Registration icon" />
          <div className="components">Registration</div>
        </Button>

        <Button
          onClick={() => handleSelectPage("About")}
          className={`functions ${selectedPage === "About" ? "active" : ""} mb-6`}
        >
          <img src="/info.png" alt="About icon" />
          <div className="components mr-7">About</div>
        </Button>

        <Button
          onClick={() => handleSelectPage("Help")}
          className={`functions ${selectedPage === "Help" ? "active" : ""} mb-6`}
        >
          <img src="/help.png" alt="Help icon" />
          <div className="components mr-8">Help</div>
        </Button>

        {/* Direct admin login button */}
        <Button
          onPress={() => setAdminLoginOpen(true)}
          className="functions mb-6"
        >
          <IconUserCog size={30} color="#ffc683" />
          <div className="mr-7">Admin</div>
        </Button>

        {/* Admin Login Modal */}
        <Modal
          isOpen={isAdminLoginOpen}
          onOpenChange={setAdminLoginOpen}
          backdrop="opaque"
          size="1xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Admin Login
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Username"
                    placeholder="Enter your Username"
                    variant="bordered"
                  />
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                  />
                  {loginError && (
                    <div className="text-red-500 mt-2">{loginError}</div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleAdminLogin}>
                    Log in
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default Sidebar;
