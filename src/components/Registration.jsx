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
  Input,
  DateInput,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
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
import "./reg.css";
import DateDisplay from "./DateDisplay.jsx";
import Clock from "./Clock.jsx";
// import * as XLSX from "xlsx";

function Registration() {
  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const pages = Math.ceil(items.length / rowsPerPage);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState("");
  const [purpose, setPurpose] = useState("");
  const [eventDate, setEventDate] = useState(new CalendarDate(2024, 4, 4));
  const [eventTime, setEventTime] = useState(new Time(11, 45));

  // const [filterDate, setFilterDate] = useState("");
  // const [filterDepartment, setFilterDepartment] = useState("");

  // const filteredItems = useMemo(() => {
  //   return items.filter((item) => {
  //     const matchDate = filterDate ? item.Date === filterDate : true;
  //     const matchDept = filterDepartment
  //       ? item.Dept.toLowerCase().includes(filterDepartment.toLowerCase())
  //       : true;
  //     return matchDate && matchDept;
  //   });
  // }, [items, filterDate, filterDepartment]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost/API/attendance.php");
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setItems(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectionChange = (key) => {
    setSelectedKey(key);
    console.log("Selected row:", key);
  };

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, items]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("opaque");

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen();
    const now = new Date();
    setEventDate(
      new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
    );
    setEventTime(new Time(now.getHours(), now.getMinutes()));
  };

  const handleTimeout = async (attendeeID) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    const data = { AttendeeID: attendeeID, TimeOut: currentTime };

    try {
      const response = await fetch("http://localhost/API/updateTimeOut.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      if (result.success) {
        console.log("TimeOut updated successfully");
        fetchData();
      } else {
        console.error("Failed to update TimeOut:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubmit = async () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    const currentDate = now.toISOString().split("T")[0];

    if (!isFormValid) return;

    const data = {
      AttendeeID: "",
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");
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

  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(filteredItems);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  //   XLSX.writeFile(workbook, "attendance.xlsx");
  // };

  const genderOptions = [
    { key: "Male", label: "Male" },
    { key: "Female", label: "Female" },
    { key: "LGBT+", label: "LGBT+" },
    { key: "Rather not say", label: "Rather not say" },
  ];

  const yearLevelOptions = [
    { key: "1st", label: "1st" },
    { key: "2nd", label: "2nd" },
    { key: "3rd", label: "3rd" },
    { key: "4th", label: "4th" },
    { key: "PEU", label: "PEU" },
  ];

  const courseOptions = [
    { key: "InfoTech", label: "InfoTech" },
    { key: "BEED", label: "BEED" },
    { key: "BSED", label: "BSED" },
    { key: "Hospitality Management", label: "Hospitality Management" },
    { key: "Tourism Management", label: "Tourism Management" },
    { key: "IndustrialTech", label: "IndustrialTech" },
    { key: "Agriculture", label: "Agriculture" },
  ];

  const purposeOptions = [
    { key: "Read books", label: "Read books" },
    { key: "Study", label: "Study" },
    { key: "Leisure", label: "Leisure" },
    { key: "Research", label: "Research" },
    { key: "Clearance", label: "Clearance" },
    { key: "School Activity", label: "School Activity" },
  ];

  return (
    <div className="p-2">
      <div className="top flex items-center mx-3">
        <h1 className="flex items-center scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-2 mr-4">
          <img
            src="/registration.png"
            alt="Registration icon"
            className="mr-2 size-14"
          />
          Registration
        </h1>
        <div className="ml-auto pr-3">
          <Clock className="top-right-clock" />
        </div>
      </div>
      <hr className="m-2 border-2 border-gray-300 " />

      <div className="searchBarAndCheckInBtn flex align items-center" style={{ margin: "-20px", marginLeft: "20px" }}>
        <DateDisplay />
        <div className="flex ml-auto flex-wrap gap-4 mb-10 justify-center sm:gap-3 md:gap-4" style={{ marginRight: "40px" }}>
          <Tooltip placement="top-end" content={<div className="px-1 py-2"><div className="text-tiny">Click to Register</div></div>}>
            <Button variant="flat" color="warning" onPress={() => handleOpen("opaque")} className="capitalize px-4 py-2 md:text-base w-[200px] h-[50px] font-serif">
              Register
            </Button>
          </Tooltip>
        </div>

        <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent className="bg-gray-200 p-6 rounded-lg shadow-lg">
            <>
              <ModalHeader className="text-2xl font-semibold">
                <img src="/registration.png" alt="Registration icon" className="mr-2 size-8" />
                Register
              </ModalHeader>
              <ModalBody className="space-y-6">
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
                      endContent={<CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                    />
                    <TimeInput
                      label="Event Time"
                      value={eventTime}
                      onChange={setEventTime}
                      labelPlacement="outside"
                      className="w-full md:w-1/2"
                      endContent={<ClockCircleLinearIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
                    />
                  </div>
                </div>
                <hr className="border-2 border-gray-300" style={{ marginTop: "3px" }} />

                <div style={{ marginTop: "10px" }}>
                  <h2 className="text-lg font-medium mb-2">Personal Information</h2>
                  <Input
                    isRequired
                    type="text"
                    label="Name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4"
                  />
                  <Input
                    isRequired
                    type="number"
                    label="Age"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full mb-4"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Select
                      isRequired
                      label="Gender"
                      placeholder="Select your gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full"
                    >
                      {genderOptions.map((option) => (
                        <SelectItem key={option.key} value={option.key}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      isRequired
                      label="Year Level"
                      placeholder="Select your year level"
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full"
                    >
                      {yearLevelOptions.map((option) => (
                        <SelectItem key={option.key} value={option.key}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <Select
                    isRequired
                    label="Course"
                    placeholder="Select your course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full mb-4"
                    allowsCustomValue={true}
                  >
                    {courseOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Autocomplete
                    isRequired
                    label="Purpose"
                    placeholder="Select or type your purpose"
                    value={purpose}
                    onInputChange={setPurpose}
                    className="w-full"
                    defaultItems={purposeOptions}
                    allowsCustomValue={true} // Allows typing custom values
                  >
                    {(item) => (
                      <AutocompleteItem key={item.key} value={item.key}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-end space-x-3">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  disabled={!isFormValid}
                  className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>

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
        classNames={{ wrapper: "h-[30.75rem]" }}
      >
        <TableHeader>
          <TableColumn className="font-serif text-lg" key="AttendeeID" width="5%">
            NO.
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Date" width="8%">
            DATE
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Name" width="18%">
            NAME
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Gender" width="8%">
            GENDER
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="YearLevel" width="9%">
            YEAR LEVEL
          </TableColumn>
          <TableColumn className="font-serif text-lg" key="Dept" width="17%">
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
              style={{ height: "0.5rem" }}
              className={`cursor-pointer text-xxs capitalize ${selectedKey === item.AttendeeID ? "table-row-selected" : "table-row-hover"}`}
            >
              {(columnKey) => (
                <TableCell key={columnKey} className="p-2.5 m-0 text-sm">
                  {columnKey === "TimeOut" ? (
                    item.TimeOut === "00:00:00" || item.TimeOut == null ? (
                      <button
                        className="border-red-400 border-1 m rounded-lg cursor-pointer p-1 bg-red-200 hover:bg-red-300"
                        style={{ marginTop: "-20px" }}
                        onClick={() => handleTimeout(item.AttendeeID)}
                      >
                        Time Out
                      </button>
                    ) : (
                      item.TimeOut
                    )
                  ) : (
                    item[columnKey]
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* <div className="export-controls mb-4">
        <h2 className="mb-2 ">Export file</h2>
        <div className="flex items-center gap-4">
          <Input
            type="date"
            label="Filter by Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="max-w-xs h-10"
          />
          <Input
            type="text"
            label="Filter by Department"
            placeholder="Enter department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="max-w-xs h-10"
          />
          {/* <Button onPress={exportToExcel} color="secondary" className="h-10 mt-0">
            Export as Excel
          </Button> */}
        </div>
    //   </div> 
    // </div>
  );
}

export default Registration;