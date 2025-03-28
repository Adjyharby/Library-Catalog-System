
import PropTypes from "prop-types";
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
// import {Listbox, ListboxItem} from "@nextui-org/react";
import { MailIcon } from "./MailIcon.jsx";
import { LockIcon } from "./LockIcon.jsx";

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
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [isLibraryOpen, setLibraryOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  // const [isGeneralOpen, setGeneralOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  Sidebar.propTypes = {
    onSelectPage: PropTypes.func.isRequired,
  };
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={toggleSidebar} className="collapse-btn">
        {collapsed ? (
          <IconLayoutSidebarRightCollapse
            className="toggle-icon"
            color="#ffc683"
          />
        ) : (
          <IconLayoutSidebarLeftCollapse
            className="toggle-icon"
            color="#ffc683"
          />
        )}
      </button>

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
        <button onClick={() => onSelectPage("Library")} className="functions">
          <img src="/library.png" alt="Library icon" />
          {!collapsed && <div className="components">Library</div>}
        </button>

        <button
          onClick={() => onSelectPage("Registration")}
          className="functions"
        >
          <img src="/registration.png" alt="Registration icon" />
          {!collapsed && <div className="components">Registration</div>}
        </button>

        <button onClick={() => onSelectPage("About")} className="functions">
          <img src="/info.png" alt="About icon" />
          {!collapsed && <div className="components">About</div>}
        </button>

        <button onClick={() => onSelectPage("Help")} className="functions">
          <img src="/help.png" alt="Help icon" />
          {!collapsed && <div className="components">Heeeeelp</div>}
        </button>

        <Popover showArrow backdrop="transparent" placement="right">
          <PopoverTrigger>
            <Button>
              <IconUserCog size={30} />
              Admin
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid grid-cols-1 space-y-1 p-2">
              <h3 className="text-small font-bold mb-1">Log in as a?</h3>
              <Button
                className="p-1 text-sm"
                onPress={() => setRegistrationOpen(true)}
              >
                Admin Help
              </Button>
              <Button
                className="p-1 text-sm"
                onPress={() => setLibraryOpen(true)}
              >
                Library Help
              </Button>
              <Button
                className="p-1 text-sm"
                onPress={() => setAccountOpen(true)}
              >
                Registration Help
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Modals */}
        <Modal
          isOpen={isRegistrationOpen}
          onOpenChange={setRegistrationOpen}
          backdrop="opaque"
          size="1xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Log in
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
                    Sign in
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isLibraryOpen}
          onOpenChange={setLibraryOpen}
          backdrop="opaque"
          size="1xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Log in
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
                    Sign in
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isAccountOpen}
          onOpenChange={setAccountOpen}
          backdrop="opaque"
          size="1xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Log in
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
                    Sign in
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Button onPress={() => onSelectPage("AdminReg")} className="functions">
          temp admin btn
        </Button>
      </div>
    </div>
  );
}


export default Sidebar;
