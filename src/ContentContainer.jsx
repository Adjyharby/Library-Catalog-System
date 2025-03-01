import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Body from "./components/Body";
import Library from "./components/Library";
import Registration from "./components/Registration";
import About from "./components/About";
import Help from "./components/Help";
import AdminReg from "./components/AdminReg";
import "./App.css";

function Main() {
  const [selectedPage, setSelectedPage] = useState("Library");

  const renderSelectedPage = () => {
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
        return <AdminReg />;
      default:
        return <Library />;
    }
  };

  return (
    <div className="main-container h-screen flex flex-col sm:flex-row overflow-hidden">
      <Sidebar onSelectPage={setSelectedPage} className="h-full" />
      <Body className="h-full flex-1">
        <div
          style={{
            backgroundColor: "#fcf8f0",
            borderRadius: "50px",
            margin: "20px auto",
            width: "100%",
            height: "100%",
            padding: "20px",
            paddingTop:'0px',
            boxSizing: "border-box",
          }}
        >
          {renderSelectedPage()}
        </div>
      </Body>
    </div>
  );
}

export default Main;
