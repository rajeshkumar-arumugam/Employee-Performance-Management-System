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
  LinearProgress,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Visibility, TrendingUp, ExpandMore, ExpandLess, AccessTime, Save, Cancel } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [viewGoal, setViewGoal] = useState(null);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [timeLogs, setTimeLogs] = useState([]);
  const [editingLog, setEditingLog] = useState(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { control: bulkControl, handleSubmit: handleBulkSubmit, reset: resetBulk, formState: { errors: bulkErrors } } = useForm();
  const { control: logControl, handleSubmit: handleLogSubmit, reset: resetLog, formState: { errors: logErrors } } = useForm();

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrms-token');
      const response = await fetch('http://localhost:5000/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
        
        // Extract time logs from goals
        const allTimeLogs = [];
        data.forEach(goal => {
          if (goal.timeLogs) {
            goal.timeLogs.forEach(log => {
              allTimeLogs.push({
                id: log.id,
                goalId: log.goal_id,
                employeeName: `${log.user.firstName} ${log.user.lastName}`,
                date: log.date,
                hoursSpent: parseFloat(log.hours_spent),
                workDescription: log.work_description
              });
            });
          }
        });
        setTimeLogs(allTimeLogs);
      } else {
        toast.error('Failed to fetch goals');
      }
    } catch (error) {
      toast.error('Error fetching goals');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGoal(null);
    reset({
      startDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      priority: 'medium',
      progress: 0,
    });
    setDialogOpen(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    reset(goal);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const token = localStorage.getItem('hrms-token');
        const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Goal deleted successfully');
          fetchGoals();
        } else {
          toast.error('Failed to delete goal');
        }
      } catch (error) {
        toast.error('Error deleting goal');
      }
    }
  };

  const handleView = (goal) => {
    setViewGoal(goal);
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('hrms-token');
      const url = editingGoal 
        ? `http://localhost:5000/api/goals/${editingGoal.id}`
        : 'http://localhost:5000/api/goals';
      
      const response = await fetch(url, {
        method: editingGoal ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        toast.success(editingGoal ? 'Goal updated successfully' : 'Goal created successfully');
        fetchGoals();
        setDialogOpen(false);
        reset();
      } else {
        toast.error('Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleBulkAssign = async (data) => {
    try {
      const token = localStorage.getItem('hrms-token');
      let targetEmployees = [];
      
      // Get employees based on assignment type
      const allEmployees = [
        { id: 1, name: 'John Doe', department: 'Engineering', role: 'employee', project: 'E-Commerce Platform' },
        { id: 2, name: 'Jane Smith', department: 'Engineering', role: 'employee', project: 'Mobile App Redesign' },
        { id: 6, name: 'Sarah Johnson', department: 'Sales', role: 'employee', project: 'Q1 Sales Drive' },
        { id: 4, name: 'Bob Wilson', department: 'Marketing', role: 'employee', project: 'Brand Campaign 2024' },
        { id: 7, name: 'David Miller', department: 'Finance', role: 'employee', project: 'Budget Planning 2024' },
      ];

      switch (assignmentType) {
        case 'all':
          targetEmployees = allEmployees;
          break;
        case 'department':
          targetEmployees = allEmployees.filter(emp => emp.department === data.filterValue);
          break;
        case 'role':
          targetEmployees = allEmployees.filter(emp => emp.role === data.filterValue);
          break;
        case 'project':
          targetEmployees = allEmployees.filter(emp => emp.project === data.filterValue);
          break;
        case 'specific':
          targetEmployees = selectedEmployees;
          break;
        default:
          targetEmployees = allEmployees;
      }

      // Create goals for each target employee
      const promises = targetEmployees.map(employee => 
        fetch('http://localhost:5000/api/goals', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            status: 'active',
            estimated_hours: parseInt(data.estimatedHours) || 0,
            start_date: data.startDate,
            due_date: data.dueDate,
            employeeId: employee.id
          })
        })
      );

      await Promise.all(promises);
      toast.success(`Goal assigned to ${targetEmployees.length} employee(s)`);
      fetchGoals();
      setBulkAssignOpen(false);
      resetBulk();
      setSelectedEmployees([]);
    } catch (error) {
      toast.error('Bulk assignment failed');
    }
  };

  const handleLogTime = async (data) => {
    try {
      const token = localStorage.getItem('hrms-token');
      const url = editingLog 
        ? `http://localhost:5000/api/goals/time-log/${editingLog.id}`
        : `http://localhost:5000/api/goals/${selectedGoal.id}/time-log`;
      
      const response = await fetch(url, {
        method: editingLog ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: data.date,
          hours_spent: parseFloat(data.hoursSpent),
          work_description: data.workDescription
        })
      });
      
      if (response.ok) {
        toast.success(editingLog ? 'Time log updated successfully' : 'Time logged successfully');
        fetchGoals();
        setLogDialogOpen(false);
        setEditingLog(null);
        resetLog();
      } else {
        toast.error('Failed to save time log');
      }
    } catch (error) {
      toast.error('Failed to save time log');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this time log?')) {
      try {
        const token = localStorage.getItem('hrms-token');
        const response = await fetch(`http://localhost:5000/api/goals/time-log/${logId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Time log deleted successfully');
          fetchGoals();
        } else {
          toast.error('Failed to delete time log');
        }
      } catch (error) {
        toast.error('Failed to delete time log');
      }
    }
  };

  const handleExpandRow = (goalId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedRows(newExpanded);
  };

  const getLogsForGoal = (goalId) => {
    let logs = timeLogs.filter(log => log.goalId === goalId);
    if (user?.role === 'employee') {
      logs = logs.filter(log => log.employeeName === `${user.firstName} ${user.lastName}`);
    }
    return logs;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'overdue': return 'error';
      case 'active': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const columns = [
    { field: 'title', headerName: 'Goal Title', width: 200 },
    ...(user?.role !== 'employee' ? [{ 
      field: 'employeeName', 
      headerName: 'Employee', 
      width: 150 
    }] : []),
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      )
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getPriorityColor(params.value)}
          size="small"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value.replace('_', ' ')} 
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'progress',
      headerName: 'Progress',
      width: 150,
      renderCell: (params) => {
        const goal = goals.find(g => g.id === params.row.id);
        return (
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              variant="determinate" 
              value={params.value} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption">
              {params.value}% ({goal?.loggedHours || 0}h/{goal?.estimatedHours || 0}h)
            </Typography>
          </Box>
        );
      },
    },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => handleExpandRow(params.row.id)}>
            {expandedRows.has(params.row.id) ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          {user?.role === 'employee' && (
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedGoal(params.row);
                setLogDialogOpen(true);
                resetLog({ date: new Date().toISOString().split('T')[0] });
              }}
            >
              <AccessTime />
            </IconButton>
          )}
          <IconButton size="small" onClick={() => handleView(params.row)}>
            <Visibility />
          </IconButton>
          {user?.role === 'admin' && (
            <>
              <IconButton size="small" onClick={() => handleEdit(params.row)}>
                <Edit />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
                <Delete />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  const getGoalStats = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const inProgress = goals.filter(g => g.status === 'in_progress').length;
    const avgProgress = goals.reduce((sum, g) => sum + g.progress, 0) / total || 0;

    return { total, completed, inProgress, avgProgress };
  };

  const { total, completed, inProgress, avgProgress } = getGoalStats();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          {user?.role === 'employee' ? 'My Goals' : 'Goal Management'}
        </Typography>
        {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager') && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
            >
              Add Goal
            </Button>
            <Button
              variant="outlined"
              startIcon={<TrendingUp />}
              onClick={() => setBulkAssignOpen(true)}
            >
              Bulk Assign
            </Button>
          </Box>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Goals
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" fontWeight={600} color="primary.main">
                {inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg Progress
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {Math.round(avgProgress)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={goals}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          autoHeight
        />
        
        {Array.from(expandedRows).map(goalId => {
          const logs = getLogsForGoal(goalId);
          const goal = goals.find(g => g.id === goalId);
          
          return (
            <Box key={goalId} sx={{ mt: 2, mb: 2, mx: 2 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Time Logs for: {goal?.title}
                  </Typography>
                  
                  {logs.length === 0 ? (
                    <Typography color="text.secondary">
                      No time logs recorded yet.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {logs.map(log => (
                        <Card key={log.id} variant="outlined">
                          <CardContent sx={{ py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2">
                                  {log.employeeName} - {log.date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {log.workDescription}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={`${log.hoursSpent}h`} 
                                  color="primary" 
                                  size="small" 
                                />
                                {user?.firstName + ' ' + user?.lastName === log.employeeName && (
                                  <Box>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => {
                                        setEditingLog(log);
                                        setSelectedGoal(goal);
                                        resetLog({
                                          date: log.date,
                                          hoursSpent: log.hoursSpent,
                                          workDescription: log.workDescription
                                        });
                                        setLogDialogOpen(true);
                                      }}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleDeleteLog(log.id)}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Goal Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    fullWidth
                  >
                    <MenuItem value="performance">Performance</MenuItem>
                    <MenuItem value="learning">Learning</MenuItem>
                    <MenuItem value="leadership">Leadership</MenuItem>
                    <MenuItem value="innovation">Innovation</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Priority"
                    fullWidth
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="startDate"
                control={control}
                rules={{ required: 'Start date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="dueDate"
                control={control}
                rules={{ required: 'Due date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Due Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                    fullWidth
                  />
                )}
              />
              {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager') && (
                <Controller
                  name="employeeName"
                  control={control}
                  rules={{ required: 'Employee is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Assign to Employee"
                      error={!!errors.employeeName}
                      helperText={errors.employeeName?.message}
                      fullWidth
                    >
                      <MenuItem value="John Doe">John Doe</MenuItem>
                      <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                      <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                      <MenuItem value="Bob Wilson">Bob Wilson</MenuItem>
                    </TextField>
                  )}
                />
              )}
              <Controller
                name="estimatedHours"
                control={control}
                rules={{ required: 'Estimated hours is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Hours"
                    type="number"
                    inputProps={{ min: 1, step: 1 }}
                    error={!!errors.estimatedHours}
                    helperText={errors.estimatedHours?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={3}
                    fullWidth
                    sx={{ gridColumn: '1 / -1' }}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingGoal ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewGoal} onClose={() => setViewGoal(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Goal Details</DialogTitle>
        <DialogContent>
          {viewGoal && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom>{viewGoal.title}</Typography>
              <Typography><strong>Description:</strong> {viewGoal.description}</Typography>
              <Typography><strong>Category:</strong> {viewGoal.category}</Typography>
              <Typography><strong>Priority:</strong> {viewGoal.priority}</Typography>
              <Typography><strong>Status:</strong> {viewGoal.status}</Typography>
              <Typography><strong>Progress:</strong> {viewGoal.progress}%</Typography>
              <Typography><strong>Start Date:</strong> {viewGoal.startDate}</Typography>
              <Typography><strong>Due Date:</strong> {viewGoal.dueDate}</Typography>
              {user?.role !== 'employee' && (
                <Typography><strong>Employee:</strong> {viewGoal.employeeName}</Typography>
              )}
              <Typography><strong>Assigned By:</strong> {viewGoal.assignedBy}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewGoal(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Assignment Dialog */}
      <Dialog open={bulkAssignOpen} onClose={() => setBulkAssignOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Goal Assignment</DialogTitle>
        <form onSubmit={handleBulkSubmit(handleBulkAssign)}>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
              <Controller
                name="title"
                control={bulkControl}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Goal Title"
                    error={!!bulkErrors.title}
                    helperText={bulkErrors.title?.message}
                    fullWidth
                  />
                )}
              />
              
              <Controller
                name="description"
                control={bulkControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Controller
                  name="category"
                  control={bulkControl}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Category"
                      error={!!bulkErrors.category}
                      helperText={bulkErrors.category?.message}
                      fullWidth
                    >
                      <MenuItem value="performance">Performance</MenuItem>
                      <MenuItem value="learning">Learning</MenuItem>
                      <MenuItem value="leadership">Leadership</MenuItem>
                      <MenuItem value="innovation">Innovation</MenuItem>
                    </TextField>
                  )}
                />
                
                <Controller
                  name="priority"
                  control={bulkControl}
                  defaultValue="medium"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Priority"
                      fullWidth
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                    </TextField>
                  )}
                />

                <TextField
                  select
                  label="Assign To"
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  <MenuItem value="department">By Department</MenuItem>
                  <MenuItem value="role">By Role</MenuItem>
                  <MenuItem value="project">By Project</MenuItem>
                  <MenuItem value="specific">Specific Employees</MenuItem>
                </TextField>
              </Box>

              {assignmentType === 'department' && (
                <Controller
                  name="filterValue"
                  control={bulkControl}
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Select Department"
                      error={!!bulkErrors.filterValue}
                      helperText={bulkErrors.filterValue?.message}
                      fullWidth
                    >
                      <MenuItem value="Engineering">Engineering</MenuItem>
                      <MenuItem value="Sales">Sales</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="HR">HR</MenuItem>
                      <MenuItem value="Design">Design</MenuItem>
                    </TextField>
                  )}
                />
              )}

              {assignmentType === 'role' && (
                <Controller
                  name="filterValue"
                  control={bulkControl}
                  rules={{ required: 'Role is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Select Role"
                      error={!!bulkErrors.filterValue}
                      helperText={bulkErrors.filterValue?.message}
                      fullWidth
                    >
                      <MenuItem value="employee">Employee</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                    </TextField>
                  )}
                />
              )}

              {assignmentType === 'project' && (
                <Controller
                  name="filterValue"
                  control={bulkControl}
                  rules={{ required: 'Project is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Select Project"
                      error={!!bulkErrors.filterValue}
                      helperText={bulkErrors.filterValue?.message}
                      fullWidth
                    >
                      <MenuItem value="E-Commerce Platform">E-Commerce Platform</MenuItem>
                      <MenuItem value="Mobile App Redesign">Mobile App Redesign</MenuItem>
                      <MenuItem value="Q1 Sales Drive">Q1 Sales Drive</MenuItem>
                      <MenuItem value="Brand Campaign 2024">Brand Campaign 2024</MenuItem>
                      <MenuItem value="Budget Planning 2024">Budget Planning 2024</MenuItem>
                    </TextField>
                  )}
                />
              )}

              {assignmentType === 'specific' && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Employees:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['John Doe', 'Jane Smith', 'Sarah Johnson', 'Bob Wilson', 'David Miller'].map((name, index) => (
                      <Chip
                        key={name}
                        label={name}
                        clickable
                        color={selectedEmployees.some(emp => emp.name === name) ? 'primary' : 'default'}
                        onClick={() => {
                          const employee = { id: index + 1, name };
                          if (selectedEmployees.some(emp => emp.name === name)) {
                            setSelectedEmployees(selectedEmployees.filter(emp => emp.name !== name));
                          } else {
                            setSelectedEmployees([...selectedEmployees, employee]);
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Controller
                name="estimatedHours"
                control={bulkControl}
                rules={{ required: 'Estimated hours is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Hours"
                    type="number"
                    inputProps={{ min: 1, step: 1 }}
                    error={!!bulkErrors.estimatedHours}
                    helperText={bulkErrors.estimatedHours?.message}
                    fullWidth
                  />
                )}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Controller
                  name="startDate"
                  control={bulkControl}
                  rules={{ required: 'Start date is required' }}
                  defaultValue={new Date().toISOString().split('T')[0]}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!bulkErrors.startDate}
                      helperText={bulkErrors.startDate?.message}
                      fullWidth
                    />
                  )}
                />
                
                <Controller
                  name="dueDate"
                  control={bulkControl}
                  rules={{ required: 'Due date is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Due Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!bulkErrors.dueDate}
                      helperText={bulkErrors.dueDate?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkAssignOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Assign Goal
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={logDialogOpen} onClose={() => { setLogDialogOpen(false); setEditingLog(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLog ? 'Edit Time Log' : 'Log Time'} - {selectedGoal?.title}</DialogTitle>
        <form onSubmit={handleLogSubmit(handleLogTime)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Controller
                name="date"
                control={logControl}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!logErrors.date}
                    helperText={logErrors.date?.message}
                    fullWidth
                  />
                )}
              />
              
              <Controller
                name="hoursSpent"
                control={logControl}
                rules={{ 
                  required: 'Hours spent is required',
                  min: { value: 0.5, message: 'Minimum 0.5 hours required' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hours Spent"
                    type="number"
                    inputProps={{ min: 0.5, step: 0.5 }}
                    error={!!logErrors.hoursSpent}
                    helperText={logErrors.hoursSpent?.message}
                    fullWidth
                  />
                )}
              />
              
              <Controller
                name="workDescription"
                control={logControl}
                rules={{ required: 'Work description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Work Description"
                    multiline
                    rows={4}
                    placeholder="Describe what you accomplished during this time..."
                    error={!!logErrors.workDescription}
                    helperText={logErrors.workDescription?.message}
                    fullWidth
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setLogDialogOpen(false); setEditingLog(null); }}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingLog ? 'Update' : 'Log Time'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Goals;