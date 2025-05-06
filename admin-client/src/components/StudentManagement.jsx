import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import AddStudent from './AddStudent';
import {
    Users, Search, Plus, Edit2, UserCheck, UserX,
    Filter, Download, RefreshCw, ChevronLeft, ChevronRight,
    AlertCircle, CheckCircle, XCircle, Moon, Sun
} from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        // Check if user has a theme preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        // Or check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return savedTheme === 'dark' || (!savedTheme && prefersDark);
    });

    useEffect(() => {
        // Apply theme to HTML element
        document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
        // Save preference to localStorage
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        fetchStudents();
    }, [page, searchTerm]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/admin-api/students', {
                params: {
                    page,
                    limit: 10,
                    search: searchTerm
                }
            });

            if (response.data.students) {
                setStudents(response.data.students);
                setTotalPages(response.data.totalPages);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            setError(error.response?.data?.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
    };

    const handleUpdate = async (studentData) => {
        try {
            await axios.put(`/admin-api/student-update/${studentData.rollNumber}`, studentData);
            setEditingStudent(null);
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleStatusToggle = async (rollNumber, currentStatus) => {
        try {
            await axios.put(`/admin-api/student-status`, {
                rollNumber,
                is_active: !currentStatus
            });
            fetchStudents();
        } catch (error) {
            console.error('Error toggling student status:', error);
        }
    };

    const handleBulkAction = async (action) => {
        try {
            await axios.post('/admin-api/students/bulk', {
                students: selectedStudents,
                action
            });
            setSelectedStudents([]);
            fetchStudents();
        } catch (error) {
            console.error('Error performing bulk action:', error);
        }
    };

    const handleAddSuccess = () => {
        setShowAddModal(false);
        fetchStudents();
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className="container mt-4">
            {/* Theme toggle and header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0 d-flex align-items-center">
                    <Users className="me-2" size={24} />
                    Student Management
                </h2>
                <button 
                    className="btn btn-outline-secondary" 
                    onClick={toggleTheme}
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <AlertCircle size={18} className="me-2" />
                    <div>{error}</div>
                </div>
            )}

            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text border-end-0">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
                        <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={18} />
                            Add Student
                        </button>
                        <div className="dropdown">
                            <button className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2" type="button" id="bulkActionsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <Filter size={18} />
                                Bulk Actions
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="bulkActionsDropdown">
                                <li><button className="dropdown-item d-flex align-items-center gap-2" disabled={!selectedStudents.length} onClick={() => handleBulkAction('activate')}><UserCheck size={16} /> Activate Selected</button></li>
                                <li><button className="dropdown-item d-flex align-items-center gap-2" disabled={!selectedStudents.length} onClick={() => handleBulkAction('deactivate')}><UserX size={16} /> Deactivate Selected</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item d-flex align-items-center gap-2"><Download size={16} /> Export Selected</button></li>
                            </ul>
                        </div>
                        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={fetchStudents}>
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <AddStudent
                            onSuccess={handleAddSuccess}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading students data...</p>
                </div>
            ) : (
                <>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th width="40">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedStudents(students.map(s => s.rollNumber));
                                                            } else {
                                                                setSelectedStudents([]);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </th>
                                            <th>Roll Number</th>
                                            <th>Name</th>
                                            <th>Branch</th>
                                            <th>Year</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length > 0 ? (
                                            students.map(student => (
                                                <tr key={student.rollNumber}>
                                                    <td>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={selectedStudents.includes(student.rollNumber)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedStudents([...selectedStudents, student.rollNumber]);
                                                                    } else {
                                                                        setSelectedStudents(selectedStudents.filter(s => s !== student.rollNumber));
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td><strong>{student.rollNumber}</strong></td>
                                                    <td>{student.name}</td>
                                                    <td>{student.branch}</td>
                                                    <td>{student.year}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill ${student.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                            {student.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleEdit(student)}
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                className={`btn ${student.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                                onClick={() => handleStatusToggle(student.rollNumber, student.is_active)}
                                                            >
                                                                {student.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    <p className="mb-0">No students found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="small">
                            Showing {students.length} of {totalPages * 10} students
                        </div>
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </>
            )}

            {/* Edit Modal */}
            {editingStudent && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <Edit2 size={18} />
                                    Edit Student
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setEditingStudent(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate(editingStudent);
                                }}>
                                    <div className="mb-3">
                                        <label htmlFor="edit-name" className="form-label">Name</label>
                                        <input
                                            id="edit-name"
                                            type="text"
                                            className="form-control"
                                            value={editingStudent.name}
                                            onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="edit-branch" className="form-label">Branch</label>
                                            <input
                                                id="edit-branch"
                                                type="text"
                                                className="form-control"
                                                value={editingStudent.branch}
                                                onChange={(e) => setEditingStudent({...editingStudent, branch: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="edit-year" className="form-label">Year</label>
                                            <select
                                                id="edit-year"
                                                className="form-select"
                                                value={editingStudent.year}
                                                onChange={(e) => setEditingStudent({...editingStudent, year: parseInt(e.target.value)})}
                                            >
                                                {[1,2,3,4].map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary" 
                                            onClick={() => setEditingStudent(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                                            <CheckCircle size={16} />
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;






