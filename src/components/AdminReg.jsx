import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Tooltip,
  Input,

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

import "./reg.css";
import DateDisplay from "./DateDisplay.jsx";
import Clock from "./Clock.jsx";
import * as XLSX from "xlsx";

export default function AdminReg() {
  const [items, setItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const pages = Math.ceil(items.length / rowsPerPage);

  const [filterDate, setFilterDate] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchDate = filterDate ? item.Date === filterDate : true;
      const matchDept = filterDepartment
        ? item.Dept.toLowerCase().includes(filterDepartment.toLowerCase())
        : true;
      return matchDate && matchDept;
    });
  }, [items, filterDate, filterDepartment]);

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance.xlsx");
  };

  return (
    <div className="p-2">
      <div className="top flex items-center mx-3">
        <h1 className="flex items-center scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-2 mr-4">
          <img
            src="/registration.png"
            alt="Registration icon"
            className="mr-2 size-14"
          />
          Registration Management
        </h1>
        <div className="ml-auto pr-3">
          <Clock className="top-right-clock" />
        </div>
      </div>
      <hr className="m-2 border-2 border-gray-300 " />

      <div className="searchBarAndCheckInBtn flex align items-center" style={{ margin: "-20px", marginLeft: "20px" }}>
       <div style={{textAlign:'center', width:'100%'}}>
       <DateDisplay />
       </div>
        <div className="flex ml-auto flex-wrap gap-4 mb-10 justify-center sm:gap-3 md:gap-4" style={{ marginRight: "40px" }}>
          <Tooltip placement="top-end" content={<div className="px-1 py-2"><div className="text-tiny">Click to Register</div></div>}>
    
          </Tooltip>
        </div>

      </div>

      <div style={{textAlign:'center', width:'100%', flex:'1', justifyItems:'center'}} className="export-controls mb-4">
        <h2 className="mb-5 font-serif ">Export file</h2>
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
          <Button onPress={exportToExcel} color="secondary" className="h-10 mt-0">
            Export as Excel
          </Button>
        </div>
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


    </div>
  );
}