import { useState, useEffect } from 'react';
import axios from 'axios';

// Empty in development (Vite proxy), set to your backend URL on Vercel
const API = (import.meta.env.VITE_API_URL || '') + '/employees';
const emptyForm = { name: '', email: '', role: '' };

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null); // null = adding, number = editing
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Load employees whenever the search text changes
  useEffect(() => {
    loadEmployees();
  }, [search]);

  async function loadEmployees() {
    const res = await axios.get(API, { params: { search } });
    setEmployees(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form); // update
      } else {
        await axios.post(API, form); // create
      }
      resetForm();
      loadEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  }

  function startEdit(emp) {
    setEditId(emp.id);
    setForm({ name: emp.name, email: emp.email, role: emp.role });
  }

  function resetForm() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this employee?')) return;
    await axios.delete(`${API}/${id}`);
    loadEmployees();
  }

  return (
    <div className="container">
      <h1>Employee Directory</h1>

      {/* ---------- Add / Edit form ---------- */}
      <form className="card form" onSubmit={handleSubmit}>
        <h2>{editId ? 'Edit Employee' : 'Add Employee'}</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="role" placeholder="Job Role" value={form.role} onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button type="submit" className="btn primary">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="btn" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {/* ---------- Search + table ---------- */}
      <div className="card">
        <input
          className="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td>
                  <button className="btn" onClick={() => startEdit(emp)}>Edit</button>
                  <button className="btn danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr><td colSpan="4" className="empty">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}