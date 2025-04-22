import { useState, useEffect } from 'react';
import axios from '../utils/axios';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    return (
        <div className="container mt-4">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row mb-4">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // Reset to first page when searching
                        }}
                    />
                </div>
                <div className="col-auto">
                    <div className="btn-group">
                        <button 
                            className="btn btn-danger"
                            disabled={!selectedStudents.length}
                            onClick={() => handleBulkAction('deactivate')}
                        >
                            Deactivate Selected
                        </button>
                        <button 
                            className="btn btn-success"
                            disabled={!selectedStudents.length}
                            onClick={() => handleBulkAction('activate')}
                        >
                            Activate Selected
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input 
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedStudents(students.map(s => s.rollNumber));
                                                } else {
                                                    setSelectedStudents([]);
                                                }
                                            }}
                                        />
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
                                {students.map(student => (
                                    <tr key={student.rollNumber}>
                                        <td>
                                            <input 
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
                                        </td>
                                        <td>{student.rollNumber}</td>
                                        <td>{student.name}</td>
                                        <td>{student.branch}</td>
                                        <td>{student.year}</td>
                                        <td>
                                            <span className={`badge ${student.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                {student.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={() => handleEdit(student)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className={`btn btn-sm ${student.is_active ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => handleStatusToggle(student.rollNumber, student.is_active)}
                                            >
                                                {student.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                    >
                                        Previous
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
                                        Next
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
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Student</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingStudent(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate(editingStudent);
                                }}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingStudent.name}
                                            onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Branch</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingStudent.branch}
                                            onChange={(e) => setEditingStudent({...editingStudent, branch: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Year</label>
                                        <select
                                            className="form-control"
                                            value={editingStudent.year}
                                            onChange={(e) => setEditingStudent({...editingStudent, year: parseInt(e.target.value)})}
                                        >
                                            {[1,2,3,4].map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
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




