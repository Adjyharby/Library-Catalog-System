import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

function Help() {
  // Define separate states for each modal
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [isLibraryOpen, setLibraryOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [isGeneralOpen, setGeneralOpen] = useState(false);

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl ml-20 mt-10 -mb-7">
        Help, how it works
      </h1>

      <div className="flex grid-cols-3 gap-10 m-20" >
        {/* Buttons to open respective modals */}
        <Button
          onPress={() => setRegistrationOpen(true)}
          className="col-span-1 p-32 "
          style={{height:"32.15rem",}}
        >
          Admin Help
        </Button>
        <Button
          onPress={() => setLibraryOpen(true)}
          className="col-span-2 p-32 "
          style={{height:"32.15rem", backgroundColor:'#57429D'}}
        >
          Library Help 
        </Button>
        <Button
          onPress={() => setAccountOpen(true)}
          className="col-span-2 p-32"
          style={{height:"32.15rem", backgroundColor:'#ffc683'}}

        >
          Registration Help
        </Button>
        
        {/* <Button
          onPress={() => setGeneralOpen(true)}
          className="col-span-1 p-28"
        >
          More Help
        </Button> */}

        {/* Registration Help Modal */}
        <Modal
          isOpen={isRegistrationOpen}
          onOpenChange={setRegistrationOpen}
          backdrop="opaque"
          size="3xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Registration Help</ModalHeader>
                <ModalBody>
                  <p>Here’s information to help with registration...</p>
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

        {/* Library Help Modal */}
        <Modal
          isOpen={isLibraryOpen}
          onOpenChange={setLibraryOpen}
          backdrop="opaque"
          size="3xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Library Help</ModalHeader>
                <ModalBody>
                  <p>Information about using the library...</p>
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

        {/* Account Help Modal */}
        <Modal
          isOpen={isAccountOpen}
          onOpenChange={setAccountOpen}
          backdrop="opaque"
          size="3xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Registration Help</ModalHeader>
                <ModalBody>
                  <p>Instructions on managing your account...</p>
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

        {/* General Help Modal */}
        <Modal
          isOpen={isGeneralOpen}
          onOpenChange={setGeneralOpen}
          backdrop="opaque"
          size="3xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>General Help</ModalHeader>
                <ModalBody>
                  <p>General information and FAQ...</p>
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
      </div>
    </div>
  );
}

export default Help;
