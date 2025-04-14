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
  // const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [isLibraryOpen, setLibraryOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);
  // const [isGeneralOpen, setGeneralOpen] = useState(false);

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl ml-20 mt-10 -mb-7">
        Help, how it works
      </h1>

      {/* Flex container with equal width buttons */}
      <div className="flex gap-10 m-20">
        {/* Library Help */}
        <Button
          onPress={() => setLibraryOpen(true)}
          className="flex-1 h-[35.50rem] text-white text-2xl"
          style={{ 
            backgroundColor: '#57429D',
            backgroundImage:'url("/book5.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '95% 95%', // you can try 'cover' too
            backgroundPosition: '10px 130px',
          }}
        >
          Library Help
        </Button>

        {/* Registration Help */}
        <Button
          onPress={() => setAccountOpen(true)}
          className="flex-1 h-[35.50rem] text-black text-2xl"
          style={{ 
            backgroundColor: '#ffc683',
            backgroundImage:'url("/book6.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '45%, 45%', // you can try 'cover' too
            backgroundPosition: '400px 100px' // 20px from left, 30px from top

          }}
        >
          Registration Help
        </Button>
      </div>

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

      {/* Registration Help Modal */}
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
                <div>
                  <img src="public/Reg-1.png" alt="reg help pic" />
                </div>
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
  );
}

export default Help;
