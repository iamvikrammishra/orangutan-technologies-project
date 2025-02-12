import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Papa from "papaparse";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function Home() {
  const [csvData, setCsvData] = useState([]);
  const [mappedColumns, setMappedColumns] = useState({});
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      Papa.parse(uploadedFile, {
        complete: (result) => setCsvData(result.data),
        header: true,
      });
    }
  };

  const standardFields = ["id", "first_name", "middle_name", "last_name", "phone_number", "address_line_1", "address_line_2", "state", "pin_code", "country"];

  const handleMappingChange = (csvColumn, mappedField) => {
    setMappedColumns({ ...mappedColumns, [csvColumn]: mappedField });
  };

  const handleSubmit = async () => {
    const transformedData = csvData.map((row) => {
      let transformedRow = {};
      Object.keys(row).forEach((key) => {
        transformedRow[mappedColumns[key]] = row[key];
      });
      return transformedRow;
    });

    await axios.post("http://localhost:8000/upload", transformedData);
    alert("CSV Data Uploaded Successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-900 via-purple-700 to-pink-500 text-white">
      {/* Header Section */}
      <header className="py-6 text-center">
        <motion.h1
          ref={headerRef}
          className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
        >
          🚀 Project for Orangutan Technologies
        </motion.h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white border-opacity-20"
        >
          {/* CSV Upload Section */}
          <h2 className="text-2xl font-semibold text-center mb-6">📂 CSV Upload & Mapping</h2>
          
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              📁 Choose File
            </motion.button>

            {file && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 text-white font-semibold"
              >
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </motion.p>
            )}

            {file && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300"
                onClick={handleSubmit}
              >
                🚀 Upload File
              </motion.button>
            )}
          </div>

          {/* Column Mapping Section */}
          {csvData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <h2 className="text-lg font-semibold text-center mb-4">🔗 Column Mapping</h2>
              <div className="bg-gray-800 bg-opacity-30 p-4 rounded-lg shadow-md">
                {Object.keys(csvData[0]).map((csvColumn, index) => (
                  <div key={index} className="flex gap-4 items-center mt-3">
                    <span className="w-40 text-gray-300 font-medium">{csvColumn}</span>
                    <select
                      className="border p-2 rounded-md bg-gray-900 text-white focus:ring-2 focus:ring-purple-400"
                      onChange={(e) => handleMappingChange(csvColumn, e.target.value)}
                    >
                      <option value="">Select Field</option>
                      {standardFields.map((field) => (
                        <option key={field} value={field}>
                          {field}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 bg-black bg-opacity-30 mt-auto">
        <p className="text-lg">Created by <span className="font-semibold text-white">Vikram Kumar Mishra</span></p>
        <p>📧 Email: devthevkmishra@gmail.com</p>
        <p>📞 Phone: +91-8227937263</p>
        <div className="flex justify-center gap-4 mt-2">
          <a
            href="https://www.linkedin.com/in/vikram-mishra-8545aa1a4/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500 transition duration-300"
          >
            🔗 LinkedIn
          </a>
          <a
            href="https://thevkmcoder.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-500 transition duration-300"
          >
            🌍 Portfolio
          </a>
        </div>
      </footer>
    </div>
  );
}
