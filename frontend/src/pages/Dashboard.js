import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Assignment,
  EmojiEvents,
  Notifications,
  ArrowForward,
  People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardStats from '../components/Dashboard/DashboardStats';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentGoals, setRecentGoals] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Configure API_BASE_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('hrms-token');
        
        // Fetch users data
        const usersResponse = await fetch(`${API_BASE_URL}/auth/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersResponse.json();
        const users = usersData.success ? usersData.data.users : [];
        
        // Fetch goals data
        const goalsResponse = await fetch(`${API_BASE_URL}/goals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const goalsData = await goalsResponse.json();
        const goals = Array.isArray(goalsData) ? goalsData : [];
        
        // Calculate stats
        const totalEmployees = users.length;
        const activeEmployees = users.filter(u => u.isActive).length;
        const completedGoals = goals.filter(g => g.status === 'completed').length;
        const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;
        
        // User-specific stats
        const myGoals = goals.filter(g => g.employeeId === user?.id);
        const myCompletedGoals = myGoals.filter(g => g.status === 'completed').length;
        const myGoalProgress = myGoals.length > 0 ? Math.round((myCompletedGoals / myGoals.length) * 100) : 0;
        
        setStats({
          totalEmployees,
          activeEmployees,
          pendingReviews: 0, // TODO: Add reviews API
          completedGoals,
          goalCompletionRate,
          averageRating: '4.2', // TODO: Calculate from reviews
          myGoals: myGoals.length,
          myCompletedGoals,
          myGoalProgress,
          reviewsReceived: 0, // TODO: Add reviews API
          myRating: '4.5', // TODO: Calculate from reviews
          performanceTrend: '+12%', // TODO: Calculate trend
        });
        
        // Set recent goals (limit to 3)
        const recentGoals = user?.role === 'employee' 
          ? myGoals.slice(0, 3)
          : goals.slice(0, 3);
        
        setRecentGoals(recentGoals.map(goal => ({
          id: goal.id,
          title: goal.title,
          progress: goal.progress || 0,
          dueDate: goal.dueDate,
          status: goal.status
        })));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
    
    // Set notifications (keep as mock for now)
    if (user?.role === 'employee') {
      setNotifications([
        {
          id: 1,
          message: 'New performance review available',
          type: 'review',
          time: '2 hours ago',
        },
        {
          id: 2,
          message: 'Goal deadline approaching',
          type: 'goal',
          time: '1 day ago',
        },
      ]);
    } else {
      setNotifications([
        {
          id: 1,
          message: 'Performance reviews pending',
          type: 'review',
          time: '1 hour ago',
        },
        {
          id: 2,
          message: 'Q4 review cycle deadline approaching',
          type: 'goal',
          time: '3 hours ago',
        },
      ]);
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'review': return <Assignment />;
      case 'goal': return <EmojiEvents />;
      default: return <Notifications />;
    }
  };

  const renderEmployeeDashboard = () => (
    <Grid container spacing={3}>
      {/* My Goals */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                My Goals
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/goals')}
              >
                View All
              </Button>
            </Box>
            <List>
              {recentGoals.map((goal) => (
                <ListItem key={goal.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <EmojiEvents />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={goal.title}
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Due: {new Date(goal.dueDate).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={goal.status.replace('_', ' ').toUpperCase()}
                            size="small"
                            color={getStatusColor(goal.status)}
                            variant="outlined"
                          />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={goal.progress}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {goal.progress}% complete
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* My Reviews */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                My Reviews
              </Typography>
              <Button size="small" endIcon={<ArrowForward />}>
                View All
              </Button>
            </Box>
            <List>
              {recentReviews.map((review) => (
                <ListItem key={review.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>
                      {review.reviewer.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={review.reviewer}
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="body2">
                            Rating: {review.rating}/5
                          </Typography>
                          <Box sx={{ display: 'flex' }}>
                            {[...Array(5)].map((_, i) => (
                              <Typography
                                key={i}
                                sx={{
                                  color: i < review.rating ? 'warning.main' : 'grey.300',
                                  fontSize: '1rem',
                                }}
                              >
                                ★
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {review.feedback.substring(0, 50)}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* My Notifications */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              My Notifications
            </Typography>
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.time}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAdminHRDashboard = () => (
    <Grid container spacing={3}>
      {/* Quick Actions */}
      {(user?.role === 'hr' || user?.role === 'admin') && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<People />}
                  onClick={() => navigate('/employees')}
                >
                  Manage Employees
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  onClick={() => navigate('/reviews')}
                >
                  Review Management
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EmojiEvents />}
                  onClick={() => navigate('/goals')}
                >
                  Goal Management
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
      
      {/* All Employees Goals */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Employee Goals
              </Typography>
              <Button size="small" endIcon={<ArrowForward />}>
                Manage All
              </Button>
            </Box>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>JD</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="John Doe - Complete React Training"
                  secondary="85% complete • Due: Feb 15, 2024"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>JS</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Jane Smith - Code Review Process"
                  secondary="60% complete • Due: Feb 28, 2024"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Reviews */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Pending Reviews
              </Typography>
              <Button size="small" endIcon={<ArrowForward />}>
                Review All
              </Button>
            </Box>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'error.main' }}>BW</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Bob Wilson - Q4 Performance Review"
                  secondary="Overdue • Assigned 3 days ago"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'info.main' }}>AB</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Alice Brown - Peer Review"
                  secondary="Due today • Self-assessment pending"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* System Notifications */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              System Notifications
            </Typography>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Assignment />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="23 performance reviews pending completion"
                  secondary="Q4 review cycle deadline approaching"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <EmojiEvents />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="89 goals completed this quarter"
                  secondary="76% completion rate across organization"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.role === 'employee' 
            ? "Here's what's happening with your performance this quarter."
            : "Here's an overview of organizational performance this quarter."
          }
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <DashboardStats stats={stats} userRole={user?.role} />
      </Box>

      {/* Role-specific content */}
      {user?.role === 'employee' ? renderEmployeeDashboard() : renderAdminHRDashboard()}
    </Container>
  );
};

export default Dashboard;