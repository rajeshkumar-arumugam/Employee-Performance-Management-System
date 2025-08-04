import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Visibility, BarChart, PieChart, ShowChart, VisibilityOff, Refresh } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrms-token');
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.data.users);
      } else {
        toast.error('Failed to fetch employees');
      }
    } catch (error) {
      toast.error('Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    reset({
      employeeId: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      department: '',
      position: '',
      dateOfJoining: '',
      project: ''
    });
    setPassword('');
    setShowPassword(false);
    setDialogOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    reset(employee);
    setPassword(''); // Clear password field
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('hrms-token');
        const response = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setEmployees(employees.filter(emp => emp.id !== id));
          toast.success('Employee deleted successfully');
        } else {
          toast.error('Failed to delete employee');
        }
      } catch (error) {
        toast.error('Error deleting employee');
      }
    }
  };

  const handleView = (employee) => {
    setViewEmployee(employee);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const updatePassword = async () => {
    if (!password || !editingEmployee) return;
    
    try {
      await api.adminUpdatePassword(editingEmployee.id, password);
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('hrms-token');
      const submitData = { ...data };
      
      // Add password if provided
      if (password) {
        submitData.password = password;
      }
      
      if (editingEmployee) {
        // Update employee
        const response = await fetch(`http://localhost:5000/api/auth/users/${editingEmployee.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submitData)
        });
        
        if (response.ok) {
          const result = await response.json();
          setEmployees(employees.map(emp => 
            emp.id === editingEmployee.id ? result.data.user : emp
          ));
          toast.success('Employee updated successfully');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to update employee');
          return;
        }
      } else {
        // Add new employee
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submitData)
        });
        
        if (response.ok) {
          fetchEmployees(); // Refresh list
          toast.success('Employee added successfully');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to add employee');
          return;
        }
      }
      
      setDialogOpen(false);
      reset();
      setPassword('');
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const columns = [
    { field: 'employeeId', headerName: 'Employee ID', width: 120 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => {
        const getRoleColor = (role) => {
          switch (role) {
            case 'admin': return 'error';
            case 'hr': return 'warning';
            case 'manager': return 'primary';
            case 'employee': return 'success';
            default: return 'default';
          }
        };
        
        return (
          <Chip 
            label={params.value} 
            color={getRoleColor(params.value)}
            size="small"
          />
        );
      }
    },
    { field: 'department', headerName: 'Department', width: 130 },
    { field: 'position', headerName: 'Position', width: 160 },
    { field: 'project', headerName: 'Current Project', width: 180 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => handleView(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const getChartData = () => {
    // Department distribution
    const departmentData = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});

    const departmentChartData = Object.entries(departmentData).map(([dept, count]) => ({
      name: dept,
      value: count,
      employees: count,
    }));

    // Role distribution
    const roleData = employees.reduce((acc, emp) => {
      acc[emp.role] = (acc[emp.role] || 0) + 1;
      return acc;
    }, {});

    const roleChartData = Object.entries(roleData).map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      value: count,
      employees: count,
    }));

    // Status distribution
    const statusData = {
      Active: employees.filter(emp => emp.isActive).length,
      Inactive: employees.filter(emp => !emp.isActive).length,
    };

    const statusChartData = Object.entries(statusData).map(([status, count]) => ({
      name: status,
      value: count,
      employees: count,
    }));

    return { departmentChartData, roleChartData, statusChartData };
  };

  const { departmentChartData, roleChartData, statusChartData } = getChartData();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  const renderChart = () => {
    const commonProps = {
      width: '100%',
      height: 300,
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <RechartsBarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#8884d8" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <RechartsPieChart>
              <Pie
                data={roleChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roleChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="employees" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Employee Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Employee
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={employees}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Box>

      {/* Charts Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Employee Analytics
            </Typography>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(e, newType) => newType && setChartType(newType)}
              size="small"
            >
              <ToggleButton value="bar">
                <BarChart sx={{ mr: 1 }} />
                Department
              </ToggleButton>
              <ToggleButton value="pie">
                <PieChart sx={{ mr: 1 }} />
                Roles
              </ToggleButton>
              <ToggleButton value="line">
                <ShowChart sx={{ mr: 1 }} />
                Status
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {renderChart()}
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Quick Stats
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Total Employees: <strong>{employees.length}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Active: <strong>{employees.filter(emp => emp.isActive).length}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Departments: <strong>{new Set(employees.map(emp => emp.department)).size}</strong>
                </Typography>
                <Typography variant="body2">
                  Managers: <strong>{employees.filter(emp => emp.role === 'manager').length}</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <Controller
                name="employeeId"
                control={control}
                rules={{ required: 'Employee ID is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee ID"
                    error={!!errors.employeeId}
                    helperText={errors.employeeId?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Role"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    fullWidth
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="department"
                control={control}
                rules={{ required: 'Department is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department"
                    error={!!errors.department}
                    helperText={errors.department?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="position"
                control={control}
                rules={{ required: 'Position is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Position"
                    error={!!errors.position}
                    helperText={errors.position?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="dateOfJoining"
                control={control}
                rules={{ required: 'Date of joining is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Joining"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dateOfJoining}
                    helperText={errors.dateOfJoining?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="project"
                control={control}
                rules={{ required: 'Project is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Current Project"
                    error={!!errors.project}
                    helperText={errors.project?.message}
                    fullWidth
                  />
                )}
              />
              <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {editingEmployee ? 'Password Management' : 'Set Password'}
                </Typography>
                <TextField
                  label={editingEmployee ? 'New Password' : 'Password'}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required={!editingEmployee}
                  helperText={editingEmployee ? 'Leave empty to keep current password' : 'Required for new employees'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton onClick={generatePassword}>
                          <Refresh />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setDialogOpen(false); setPassword(''); }}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingEmployee ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewEmployee} onClose={() => setViewEmployee(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {viewEmployee && (
            <Box sx={{ mt: 1 }}>
              <Typography><strong>Employee ID:</strong> {viewEmployee.employeeId}</Typography>
              <Typography><strong>Name:</strong> {viewEmployee.firstName} {viewEmployee.lastName}</Typography>
              <Typography><strong>Email:</strong> {viewEmployee.email}</Typography>
              <Typography><strong>Role:</strong> {viewEmployee.role}</Typography>
              <Typography><strong>Department:</strong> {viewEmployee.department}</Typography>
              <Typography><strong>Position:</strong> {viewEmployee.position}</Typography>
              <Typography><strong>Current Project:</strong> {viewEmployee.project}</Typography>
              <Typography><strong>Date of Joining:</strong> {viewEmployee.dateOfJoining}</Typography>
              <Typography><strong>Status:</strong> {viewEmployee.isActive ? 'Active' : 'Inactive'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewEmployee(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employees;