import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function AdminHelp() {
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
          style={{height:"35.50rem",}}
        >
          Admin Help
        </Button>
        

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
                <ModalHeader>Admin Help</ModalHeader>
                <ModalBody>
                  <p>Here’s information to help with Admin...</p>
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


