import { useEffect, useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import { CalendarIcon } from "./ui/CalendarIcon";
import { TimeInput } from "@nextui-org/react";
import { ClockCircleLinearIcon } from "./ui/ClockCircleLinearIcon";
import { Time } from "@internationalized/date";
import { Input } from "@nextui-org/react";
import { DateInput } from "@nextui-org/react";
import "./reg.css";
import DateDisplay from "./DateDisplay.jsx";
import Clock from "./Clock.jsx";

function Registration() {
  // State to hold the fetched data
  const [items, setItems] = useState([]); // Stores the list of attendees
  const [selectedKey, setSelectedKey] = useState(null); // Tracks the selected row
  const [page, setPage] = useState(1); // Current page for pagination
  const rowsPerPage = 8; // Set rows per page
  const pages = Math.ceil(items.length / rowsPerPage); // Calculate total pages

  // State for modal form inputs
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState("");
  const [purpose, setPurpose] = useState("");
  const [eventDate, setEventDate] = useState(new CalendarDate(2024, 4, 4)); // Default date
  const [eventTime, setEventTime] = useState(new Time(11, 45)); // Default time

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost/API/attendance.php");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setItems(result); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle selection change
  const handleSelectionChange = (key) => {
    setSelectedKey(key); // Set the selected row's key
    console.log("Selected row:", key); // Logs the currently selected row key
  };

  // Compute items for the current page
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, items]);

  // Modal state management
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("opaque");

  const backdrops = ["opaque"];

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen(); // Open the modal
    const now = new Date();

    setEventDate(new CalendarDate(now.getFullYear(), now.getMonth(), now.getDate()));
  setEventTime(new Time(now.getHours(), now.getMinutes()));

  setBackdrop(backdrop);
  onOpen(); // Open the modal
  };

  // Handle timeout submission
  const handleTimeout = async (attendeeID) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0]; // Get current time (HH:MM:SS)

    const data = {
      AttendeeID: attendeeID,
      TimeOut: currentTime,
    };

    try {
      const response = await fetch("http://localhost/API/updateTimeOut.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.success) {
        console.log("TimeOut updated successfully");
        fetchData(); // Refresh data after updating timeout
      } else {
        console.error("Failed to update TimeOut:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  

  // Handle form submission
  const handleSubmit = async () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0]; // Get current time
    // const currentDate = now.toISOString().split("T")[0]; 

    const currentDate = new Date(now.setDate(now.getDate() + 1)).toISOString().split("T")[0];
    
    console.log("Tomorrow's Date:", currentDate);
    
    

    if (!isFormValid) return;

    const data = {
      AttendeeID: "", // Generate or fetch a unique ID if required
      Name: name || "",
      Gender: gender || "",
      Age: age || "",
      Dept: course || "",
      TimeIn: currentTime,
      Date: currentDate,
      YearLevel: yearLevel || "",
      purpose: purpose || "",
    };

    try {
      const response = await fetch("http://localhost/API/Attendance.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // const result = await response.json();

      onClose();
      setName("");
      setGender("");
      setAge("");
      setCourse("");  
      setYearLevel("");
      setPurpose("");
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      name.trim() !== "" &&
      age.trim() !== "" &&
      gender.trim() !== "" &&
      yearLevel.trim() !== "" &&
      course.trim() !== "" &&
      purpose.trim() !== ""
    );
  }, [name, age, gender, yearLevel, course, purpose]);
  

  return (
    <div className="p-2">
      <div className="top flex items-center mx-3">
        <h1 className="flex items-center scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-2 mr-4">
          <img
            src="/registration.png"
            alt="Registration icon"
            color="#ffc683"
            className="mr-2 size-14"
          />
          Registration
        </h1>
        <div className="ml-auto pr-3">
          <Clock className="top-right-clock" />
        </div>
      </div>

      <hr className="m-2 border-2 border-gray-300 " />

      {/* Search Bar and Check-In Button */}
      <div
        className="searchBarAndCheckInBtn flex align items-center"
        style={{ margin: "-20px", marginLeft: "20px" }}
      >
        <DateDisplay />

        {/* PopOutButton */}
        <div
          className="flex ml-auto flex-wrap gap-4 mb-10 justify-center sm:gap-3 md:gap-4"
          style={{ marginRight: "40px" }}
        >
          {backdrops.map((b) => (
            <Tooltip
              key={b}
              placement={"top-end"}
              content={
                <div className="px-1 py-2">
                  <div className="text-tiny">Click to Register</div>
                </div>
              }
            >
              <Button
                variant="flat"
                color="warning"
                onPress={() => handleOpen(b)}
                className="capitalize px-4 py-2 md:text-base w-[200px] h-[50px] font-serif"
              >
                Register
              </Button>
            </Tooltip>
          ))}
        </div>

        <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent className="bg-gray-200 p-6 rounded-lg shadow-lg">
            <>
              <ModalHeader className="text-2xl font-semibold">
                <img
                  src="/registration.png"
                  alt="Registration icon"
                  color="#ffc683"
                  className="mr-2 size-8"
                />
                Register
              </ModalHeader>
              <ModalBody className="space-y-6">
                {/* Date and Time Section */}
        <div>
          <h2 className="text-lg font-medium mb-2">Date and Time</h2>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <DateInput
              label="Date"
              value={eventDate}
              onChange={setEventDate}
              placeholderValue={new CalendarDate(1995, 11, 6)}
              labelPlacement="outside"
              className="w-full md:w-1/2"
              endContent={
                <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
            <TimeInput
              label="Event Time"
              value={eventTime}
              onChange={setEventTime}
              labelPlacement="outside"
              className="w-full md:w-1/2"
              endContent={
                <ClockCircleLinearIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
        </div>

                <hr
                  className="border-2 border-gray-300"
                  style={{ marginTop: "3px" }}
                />

                {/* Registration Details Section */}
                <div style={{ marginTop: "10px" }}>
                  <h2 className="text-lg font-medium mb-2">
                    Personal Information
                  </h2>

                  {/* Name */}
                  <Input
                    isRequired
                    type="text"
                    label="Name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4"
                  />

                  {/* Age Field */}
                  <Input
                    isRequired
                    type="number" // Set input type to number
                    label="Age"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full mb-4"
                  />

                  {/* Gender and Year Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      isRequired
                      type="text"
                      label="Gender"
                      placeholder="Enter your gender(Male, Female, LGBT+...)"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full mb-4"
                    />

                    <Input
                      isRequired
                      type="text"
                      label="Year Level"
                      placeholder="Enter your year level (1st, 2nd, 3rd, 4th)"
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full mb-4"
                    />
                  </div>

                  {/* Course */}
                  <Input
                    isRequired
                    type="text"
                    label="Course"
                    placeholder="Enter course(Infotech, Education...)"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full mb-4"
                  />

                  {/* Purpose */}
                  <Input
                    isRequired
                    type="text"
                    label="Purpose"
                    placeholder="What is your purpose..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full"
                  />
                </div>
              </ModalBody>

              <ModalFooter className="flex justify-end space-x-3">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  disabled={!isFormValid} // Tied to form validation
                  className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""} // Optional: Add styling for disabled state
                >
                  Save
                </Button>

              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>

      {/* Table */}
      <Table
        aria-label="Example table with single selection"
        onSelectionChange={handleSelectionChange}
        selectionMode="single"
        showSelectionCheckboxes
        bottomContent={
          <div className="flex w-full justify-center">
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
        classNames={{
          wrapper: "h-[593px]",
        }}
      >
        <TableHeader>
          <TableColumn
            className="font-serif text-lg"
            key="AttendeeID"
            width="5%"
          >
            NO.
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Date" width="8%">
            DATE
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Name" width="15%">
            NAME
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Gender" width="8%">
            GENDER
          </TableColumn>
          <TableColumn
            className="font-serif text-lg"
            key="YearLevel"
            width="9%"
          >
            YEAR LEVEL
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Dept" width="20%">
            DEPARTMENT
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="purpose" width="20%">
            PURPOSE
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="TimeIn" width="15%">
            TIME-IN
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="TimeOut" width="1%">
            TIME-OUT
          </TableColumn>
        </TableHeader>
        <TableBody items={paginatedItems}>
  {(item) => (
    <TableRow
      key={item.AttendeeID}
      data-selected={selectedKey === item.AttendeeID ? "true" : undefined}
      onClick={() => setSelectedKey(item.AttendeeID)}
      style={{ height: "40px" }}
      className={`cursor-pointer text-xxs capitalize ${selectedKey === item.AttendeeID ? "table-row-selected" : "table-row-hover"}`}
    >
      {(columnKey) => (
        <TableCell key={columnKey} className="p-2.5 m-0 text-sm">
          {columnKey === "TimeOut" ? (
            item.TimeOut === '00:00:00' || item.TimeOut == null ? ( // Check if TimeOut is '00:00:00' or null
              <button
                className="border-red-400 border-1 m rounded-lg cursor-pointer p-1 bg-red-200 hover:bg-red-300"
                style={{ marginTop: "-20px" }}
                onClick={() => handleTimeout(item.AttendeeID)} // Send the current row's ID to handleTimeout
              >
                Time Out
              </button>
            ) : (
              item.TimeOut // Display the TimeOut value if it's available
            )
          ) : (
            item[columnKey] // For other columns, just display the value
          )}
        </TableCell>
      )}
    </TableRow>
  )}
</TableBody>


      </Table>
    </div>
  );
}

export default Registration;
