import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaCog } from 'react-icons/fa';

function App() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', employeeId: '', department: '', designation: '', project: '', type: '', status: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5000/employees')
      .then(res => setEmployees(res.data));
  };

  const handleSubmit = () => {
    const method = formData.id ? 'put' : 'post';
    const url = formData.id ? `http://localhost:5000/employees/${formData.id}` : 'http://localhost:5000/employees';

    axios[method](url, formData).then(() => {
      fetchEmployees();
      setFormData({ name: '', employeeId: '', department: '', designation: '', project: '', type: '', status: '' });
      setShowForm(false);
    });
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      axios.delete(`http://localhost:5000/employees/${id}`).then(fetchEmployees);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-100 p-5 border-r">
        <h1 className="text-xl font-bold text-blue-600">RS-TECH</h1>
        <ul className="mt-10 space-y-4">
          <li className="text-gray-600">Dashboard</li>
          <li className="text-blue-500 font-semibold">Employee</li>
          <li className="text-gray-600">Calendar</li>
          <li className="text-gray-600">Messages</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5 flex flex-col">
        {/* Top Bar */}
        <div className="w-full flex justify-end items-center bg-white border-b border-gray-200 px-6 py-3 space-x-4">
          <FaCog className="text-gray-600 hover:text-blue-500 text-xl cursor-pointer" />
          <FaBell className="text-gray-600 hover:text-blue-500 text-xl cursor-pointer" />
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />
        </div>

        {/* Page Header + Actions */}
        <div className="flex justify-between items-center px-8 py-4">
          <h2 className="text-2xl font-semibold">Employee</h2>

          <div className="flex space-x-4 items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded focus:outline-none"
            />
            <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
              + Add New Employee
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="px-8">
          <table className="table-auto w-full border rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                {['Employee Name', 'Employee ID', 'Department', 'Designation', 'Project', 'Type', 'Status', 'Action'].map(h => (
                  <th key={h} className="p-2 border text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border hover:bg-gray-50">
                  <td className="p-2 flex items-center gap-2">
                    <img src="https://i.pravatar.cc/30" alt="avatar" className="rounded-full w-8 h-8" />
                    {emp.name}
                  </td>
                  <td className="p-2">{emp.employeeId}</td>
                  <td className="p-2">{emp.department}</td>
                  <td className="p-2">{emp.designation}</td>
                  <td className="p-2">{emp.project}</td>
                  <td className="p-2">{emp.type}</td>
                  <td className="p-2">{emp.status}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(emp)}>✏️</button>
                    <button onClick={() => handleDelete(emp.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
              <h3 className="text-xl font-semibold mb-4">{formData.id ? "Edit" : "Add"} Employee</h3>
              <div className="grid grid-cols-2 gap-4">
                {['name', 'employeeId', 'department', 'designation', 'project', 'type', 'status'].map(key => (
                  <input
                    key={key}
                    type="text"
                    placeholder={key}
                    value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="border p-2 rounded"
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
