import { useState } from "react";
import Sidebar from "./components/Sidebar";
import AdminSideBar from "./components/AdminSideBar";
import Body from "./components/Body";
import Library from "./components/Library";
import Registration from "./components/Registration";
import About from "./components/About";
import Help from "./components/Help";
import AdminReg from "./components/AdminReg";
import AdminLib from "./components/AdminLib";
import AdminHelp from "./components/AdminHelp"
import Accounts from "./components/Accounts";
import "./App.css";

function Main() {
  const [selectedPage, setSelectedPage] = useState("Library");

  const renderContent = () => {
    // When in admin mode, render the AdminReg component as main content.
    switch (selectedPage) {
      case "Library":
        return <Library />;
      case "Registration":
        return <Registration />;
      case "About":
        return <About />;
      case "Help":
        return <Help />;
        case "AdminReg":
            return <AdminReg/>;
            case "AdminHelp":
              return <AdminHelp/>;
      case "AdminLib":
        return <AdminLib/>;
        case "Accounts":
        return <Accounts />;
        case "Logout":
          return <Library />;
        case "Admin":
          return <AdminLib />;
  
      default:
        return <Library />;
    }
  };

  return (
    <div className="main-container h-screen flex overflow-hidden">
      {/* Render different sidebar components based on the selected page */}
      {selectedPage === "Admin" ||selectedPage === "AdminLib" || selectedPage === "AdminReg" || selectedPage === "AdminHelp" || selectedPage === "Accounts"? (
        <AdminSideBar onSelectPage={setSelectedPage}/>
      ) : (
        <Sidebar onSelectPage={setSelectedPage} />
      )}
      <Body className="h-full flex-1">
        <div
          style={{
            backgroundColor: "#fcf8f0",
            borderRadius: "50px",
            margin: "20px auto",
            width: "100%",
            height: "100%",
            padding: "20px",
            paddingTop: "0px",
            boxSizing: "border-box",
          }}
        >
          {renderContent()}
        </div>
      </Body>
    </div>
  );
}

export default Main;
