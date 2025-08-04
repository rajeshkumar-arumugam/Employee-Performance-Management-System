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
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Visibility } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewData, setReviewData] = useState({
    effortDeviation: '',
    strPassRate: '',
    qaPassRate: '',
    customerDelight: '',
    aiTaskCompletion: '',
    aiAssessment: ''
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchReviews();
    fetchEmployees();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hrms-token');
      const response = await fetch('http://localhost:5000/api/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (error) {
      toast.error('Error fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('hrms-token');
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        // Filter only employees for reviews
        const employeeUsers = data.data.users.filter(user => user.role === 'employee');
        setEmployees(employeeUsers);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const calculateScore = (metric, value) => {
    const scoring = {
      effortDeviation: [
        { range: 'Less than 5%', points: 30 },
        { range: '5% to 10%', points: 25 },
        { range: '10% to 20%', points: 20 },
        { range: '20% to 40%', points: 15 },
        { range: '40% to 60%', points: 10 },
        { range: 'More than 60%', points: 5 }
      ],
      strPassRate: [
        { range: '100% + support', points: 20 },
        { range: '90% to 100%', points: 17 },
        { range: '80% to 90%', points: 15 },
        { range: '70% to 80%', points: 12 },
        { range: '65% to 70%', points: 10 },
        { range: '60% to 65%', points: 7 },
        { range: '55% to 60%', points: 5 },
        { range: '50% to 55%', points: 3 },
        { range: 'Less than 50%', points: 0 }
      ],
      qaPassRate: [
        { range: '100% + support', points: 20 },
        { range: '90% to 100%', points: 17 },
        { range: '80% to 90%', points: 15 },
        { range: '70% to 80%', points: 12 },
        { range: '65% to 70%', points: 10 },
        { range: '60% to 65%', points: 7 },
        { range: '55% to 60%', points: 5 },
        { range: '50% to 55%', points: 3 },
        { range: 'Less than 50%', points: 0 }
      ],
      customerDelight: [
        { range: 'More than 1 + initiatives', points: 10 },
        { range: 'More than 1 Appreciation', points: 7 },
        { range: '1 Appreciation', points: 5 },
        { range: 'No appreciations', points: 0 }
      ],
      aiTaskCompletion: [
        { range: 'All + leaderboard', points: 10 },
        { range: 'Completed all', points: 7 },
        { range: 'Until Week 5', points: 5 },
        { range: 'Less than 3 Assignments', points: 2 }
      ],
      aiAssessment: [
        { range: 'Passed', points: 10 },
        { range: 'Attempted, Failed', points: 5 },
        { range: 'Eligible only', points: 2 }
      ]
    };
    
    return scoring[metric]?.find(s => s.range === value)?.points || 0;
  };

  const calculateTotalScore = () => {
    const weights = {
      effortDeviation: 30,
      strPassRate: 20,
      qaPassRate: 20,
      customerDelight: 10,
      aiTaskCompletion: 10,
      aiAssessment: 10
    };

    let total = 0;
    Object.keys(reviewData).forEach(key => {
      const score = calculateScore(key, reviewData[key]);
      const maxPoints = key === 'effortDeviation' ? 30 : 
                      key === 'strPassRate' || key === 'qaPassRate' ? 20 : 10;
      const weightedScore = (score / maxPoints) * weights[key];
      total += weightedScore;
    });

    return Math.round(total);
  };

  const getFinalRating = (score) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 75) return 'Exceeds Expectations';
    if (score >= 60) return 'Meets Expectations';
    if (score >= 40) return 'Needs Improvement';
    return 'Key Result Area Not Met';
  };

  const onSubmit = async (data) => {
    try {
      const totalScore = calculateTotalScore();
      const finalRating = getFinalRating(totalScore);
      
      const reviewSubmission = {
        employeeId: parseInt(data.employeeId),
        reviewPeriod: data.reviewPeriod,
        reviewType: 'manager',
        overallRating: Math.round(totalScore / 20), // Convert to 1-5 scale
        effortDeviation: reviewData.effortDeviation,
        strPassRate: reviewData.strPassRate,
        qaPassRate: reviewData.qaPassRate,
        customerDelight: reviewData.customerDelight,
        aiTaskCompletion: reviewData.aiTaskCompletion,
        aiAssessment: reviewData.aiAssessment,
        totalScore,
        finalRating,
        status: 'submitted'
      };

      const token = localStorage.getItem('hrms-token');
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewSubmission)
      });

      if (response.ok) {
        toast.success('Performance review submitted successfully');
        fetchReviews(); // Refresh the list
        setDialogOpen(false);
        reset();
        setReviewData({
          effortDeviation: '',
          strPassRate: '',
          qaPassRate: '',
          customerDelight: '',
          aiTaskCompletion: '',
          aiAssessment: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const columns = [
    { field: 'employeeName', headerName: 'Employee', width: 150 },
    { field: 'reviewPeriod', headerName: 'Period', width: 120 },
    { field: 'totalScore', headerName: 'Score', width: 100 },
    { 
      field: 'finalRating', 
      headerName: 'Rating', 
      width: 180,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'Outstanding' ? 'success' :
            params.value === 'Exceeds Expectations' ? 'primary' :
            params.value === 'Meets Expectations' ? 'info' :
            params.value === 'Needs Improvement' ? 'warning' : 'error'
          }
          size="small"
        />
      )
    },
    { field: 'reviewDate', headerName: 'Date', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <Button size="small" onClick={() => {
            setSelectedReview(params.row);
            setViewDialogOpen(true);
          }}>
            <Visibility />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Performance Reviews
        </Typography>
        {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            New Review
          </Button>
        )}
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={reviews}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Performance Review</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="employeeId"
                  control={control}
                  rules={{ required: 'Employee is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Employee"
                      fullWidth
                      error={!!errors.employeeId}
                      helperText={errors.employeeId?.message}
                    >
                      {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="reviewPeriod"
                  control={control}
                  rules={{ required: 'Review period is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Review Period"
                      fullWidth
                      error={!!errors.reviewPeriod}
                      helperText={errors.reviewPeriod?.message}
                    >
                      <MenuItem value="Q1 (Apr-Jun)">Q1 (Apr-Jun)</MenuItem>
                      <MenuItem value="Q2 (Jul-Sep)">Q2 (Jul-Sep)</MenuItem>
                      <MenuItem value="Q3 (Oct-Dec)">Q3 (Oct-Dec)</MenuItem>
                      <MenuItem value="Q4 (Jan-Mar)">Q4 (Jan-Mar)</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Effort Deviation (30%)"
                  value={reviewData.effortDeviation}
                  onChange={(e) => setReviewData({...reviewData, effortDeviation: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="Less than 5%">Less than 5% (30 pts)</MenuItem>
                  <MenuItem value="5% to 10%">5% to 10% (25 pts)</MenuItem>
                  <MenuItem value="10% to 20%">10% to 20% (20 pts)</MenuItem>
                  <MenuItem value="20% to 40%">20% to 40% (15 pts)</MenuItem>
                  <MenuItem value="40% to 60%">40% to 60% (10 pts)</MenuItem>
                  <MenuItem value="More than 60%">More than 60% (5 pts)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="STR 1st Pass Rate (20%)"
                  value={reviewData.strPassRate}
                  onChange={(e) => setReviewData({...reviewData, strPassRate: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="100% + support">100% + support (20 pts)</MenuItem>
                  <MenuItem value="90% to 100%">90% to 100% (17 pts)</MenuItem>
                  <MenuItem value="80% to 90%">80% to 90% (15 pts)</MenuItem>
                  <MenuItem value="70% to 80%">70% to 80% (12 pts)</MenuItem>
                  <MenuItem value="65% to 70%">65% to 70% (10 pts)</MenuItem>
                  <MenuItem value="60% to 65%">60% to 65% (7 pts)</MenuItem>
                  <MenuItem value="55% to 60%">55% to 60% (5 pts)</MenuItem>
                  <MenuItem value="50% to 55%">50% to 55% (3 pts)</MenuItem>
                  <MenuItem value="Less than 50%">Less than 50% (0 pts)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="QA 1st Pass Rate (20%)"
                  value={reviewData.qaPassRate}
                  onChange={(e) => setReviewData({...reviewData, qaPassRate: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="100% + support">100% + support (20 pts)</MenuItem>
                  <MenuItem value="90% to 100%">90% to 100% (17 pts)</MenuItem>
                  <MenuItem value="80% to 90%">80% to 90% (15 pts)</MenuItem>
                  <MenuItem value="70% to 80%">70% to 80% (12 pts)</MenuItem>
                  <MenuItem value="65% to 70%">65% to 70% (10 pts)</MenuItem>
                  <MenuItem value="60% to 65%">60% to 65% (7 pts)</MenuItem>
                  <MenuItem value="55% to 60%">55% to 60% (5 pts)</MenuItem>
                  <MenuItem value="50% to 55%">50% to 55% (3 pts)</MenuItem>
                  <MenuItem value="Less than 50%">Less than 50% (0 pts)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Customer Delight (10%)"
                  value={reviewData.customerDelight}
                  onChange={(e) => setReviewData({...reviewData, customerDelight: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="More than 1 + initiatives">More than 1 + initiatives (10 pts)</MenuItem>
                  <MenuItem value="More than 1 Appreciation">More than 1 Appreciation (7 pts)</MenuItem>
                  <MenuItem value="1 Appreciation">1 Appreciation (5 pts)</MenuItem>
                  <MenuItem value="No appreciations">No appreciations (0 pts)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="AI Task Completion (10%)"
                  value={reviewData.aiTaskCompletion}
                  onChange={(e) => setReviewData({...reviewData, aiTaskCompletion: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="All + leaderboard">All + leaderboard (10 pts)</MenuItem>
                  <MenuItem value="Completed all">Completed all (7 pts)</MenuItem>
                  <MenuItem value="Until Week 5">Until Week 5 (5 pts)</MenuItem>
                  <MenuItem value="Less than 3 Assignments">Less than 3 Assignments (2 pts)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="AI Assessment (10%)"
                  value={reviewData.aiAssessment}
                  onChange={(e) => setReviewData({...reviewData, aiAssessment: e.target.value})}
                  fullWidth
                >
                  <MenuItem value="Passed">Passed (10 pts)</MenuItem>
                  <MenuItem value="Attempted, Failed">Attempted, Failed (5 pts)</MenuItem>
                  <MenuItem value="Eligible only">Eligible only (2 pts)</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="h6">Score Preview</Typography>
                        <Typography variant="h4" color="primary">
                          {calculateTotalScore()}/100
                        </Typography>
                        <Typography variant="subtitle1">
                          {getFinalRating(calculateTotalScore())}
                        </Typography>
                      </Box>
                      <Typography variant="h1" sx={{ fontSize: '4rem' }}>
                        {(() => {
                          const score = calculateTotalScore();
                          if (score >= 90) return '🤩'; // Outstanding
                          if (score >= 75) return '😊'; // Exceeds Expectations
                          if (score >= 60) return '🙂'; // Meets Expectations
                          if (score >= 40) return '😐'; // Needs Improvement
                          return '😞'; // Key Result Area Not Met
                        })()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Submit Review</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Details</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box>
              <Typography><strong>Employee:</strong> {selectedReview.employeeName}</Typography>
              <Typography><strong>Period:</strong> {selectedReview.reviewPeriod}</Typography>
              <Typography><strong>Total Score:</strong> {selectedReview.totalScore}/100</Typography>
              <Typography><strong>Final Rating:</strong> {selectedReview.finalRating}</Typography>
              <Typography><strong>Review Date:</strong> {selectedReview.reviewDate}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reviews;