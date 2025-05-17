import { useState } from "react";
import { IconUserCog } from "@tabler/icons-react";
import {
  Button,

} from "@nextui-org/react";
import PropTypes from "prop-types";

function Sidebar({ onSelectPage }) {
  const [selectedPage, setSelectedPage] = useState("Library");
  
  const handleSelectPage = (page) => {
    setSelectedPage(page);
    onSelectPage(page);
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
          onClick={() => handleSelectPage("AdminLib")}
          className={`functions ${selectedPage === "AdminLib" ? "active" : ""} mb-6`}
        >
          <img src="/library.png" alt="Library icon" />
          <div className="components mr-7">Catalog</div>
        </Button>

        <Button
          onClick={() => handleSelectPage("AdminReg")}
          className={`functions ${selectedPage === "AdminReg" ? "active" : ""} mb-6`}
        >
          <img src="/registration.png" alt="Registration icon" />
          <div className="components mr-2">Registration</div>
        </Button>

        <Button
          onClick={() => handleSelectPage("Accounts")}
          className={`functions ${selectedPage === "Accounts" ? "active" : ""} mb-6`}
        >
          <img src="/info.png" alt="About icon" />
          <div className="components mr-6">Accounts</div>
        </Button>

        <Button
          onClick={() => handleSelectPage("AdminHelp")}
          className={`functions ${selectedPage === "AdminHelp" ? "active" : ""} mb-6`}
        >
          <img src="/help.png" alt="Help icon" />
          <div className="components mr-12">Help</div>
        </Button>

        {/* Logout*/}
        <Button
          onClick={() => handleSelectPage("Logout")}
          className={`functions ${selectedPage === "Logout" ? "active" : ""} mb-6 `}
        >
                    <IconUserCog size={30} color="#ffc683" className="mr-5"/>
          <div className="mr-10">Logout</div>
        </Button>


      </div>
    </div>
  );
}

export default Sidebar;
