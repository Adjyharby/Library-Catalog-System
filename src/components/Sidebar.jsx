import { useState } from "react";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconUserCog,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { MailIcon } from "./MailIcon.jsx";
import { LockIcon } from "./LockIcon.jsx";
import PropTypes from 'prop-types';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";

function Sidebar({ onSelectPage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdminLoginOpen, setAdminLoginOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("Library");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    onSelectPage(page);
  };

  Sidebar.propTypes = {
    onSelectPage: PropTypes.func.isRequired,
  };
  
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {!collapsed && (
        <div className="library-logo">
          <img src="/LibrarySystemLogo.png" alt="Library logo" />
        </div>
      )}

      {!collapsed && (
        <div className="logo">
          <img className="logo-pic" src="/BSC_logo.png" alt="College logo" />
        </div>
      )}

    <div className="buttons">
      <Button
        onClick={() => handleSelectPage("Library")}
        className={`functions ${selectedPage === "Library" ? "active" : ""} mb-6`}
        key="library"
      >
        <img src="/library.png" alt="Library icon" />
        {!collapsed && <div className= "components mr-7">Library</div>}
      </Button>

      <Button
        onClick={() => handleSelectPage("Registration")}
        className={`functions ${selectedPage === "Registration" ? "active" : ""} mb-6`}
      >
        <img src="/registration.png" alt="Registration icon" />
        {!collapsed && <div className="components">Registration</div>}
      </Button>

      <Button
        onClick={() => handleSelectPage("About")}
        className={`functions ${selectedPage === "About" ? "active" : ""} mb-6`}
      >
        <img src="/info.png" alt="About icon" />
        {!collapsed && <div className="components mr-7">About</div>}
      </Button>

      <Button
        onClick={() => handleSelectPage("Help")}
        className={`functions ${selectedPage === "Help" ? "active" : ""} mb-6`}
      >
        <img src="/help.png" alt="Help icon" />
        {!collapsed && <div className="components mr-8">Help</div>}
      </Button>

      {/* Direct admin login button - no popover */}
      <Button 
        onPress={() => setAdminLoginOpen(true)}
        className="functions mb-6"
      >
        <IconUserCog size={30} color="#ffc683"/>
        {!collapsed && <div className="mr-7">Admin</div>}
      </Button>

      {/* Single Admin Login Modal */}
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
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Username"
                  placeholder="Enter your Username"
                  variant="bordered"
                />
                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
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