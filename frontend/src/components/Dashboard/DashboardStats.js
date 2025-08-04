import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  EmojiEvents,
  Assessment,
  Star,
} from '@mui/icons-material';

const StatCard = ({ title, value, subtitle, icon: Icon, color, progress }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight={600}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color}.main`,
            width: 56,
            height: 56,
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Avatar>
      </Box>
      
      {progress !== undefined && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: `${color}.main`,
              },
            }}
          />
        </Box>
      )}
    </CardContent>
  </Card>
);

const DashboardStats = ({ stats, userRole }) => {
  const getStatsForRole = () => {
    if (userRole === 'admin' || userRole === 'hr') {
      return [
        {
          title: 'Total Employees',
          value: stats?.totalEmployees || 0,
          subtitle: `${stats?.activeEmployees || 0} active`,
          icon: People,
          color: 'primary',
        },
        {
          title: 'Pending Reviews',
          value: stats?.pendingReviews || 0,
          subtitle: 'This quarter',
          icon: Assessment,
          color: 'warning',
        },
        {
          title: 'Goals Completed',
          value: stats?.completedGoals || 0,
          subtitle: `${stats?.goalCompletionRate || 0}% completion rate`,
          icon: EmojiEvents,
          color: 'success',
          progress: stats?.goalCompletionRate || 0,
        },
        {
          title: 'Average Rating',
          value: stats?.averageRating || '0.0',
          subtitle: 'Organization wide',
          icon: Star,
          color: 'info',
        },
      ];
    } else {
      return [
        {
          title: 'My Goals',
          value: stats?.myGoals || 0,
          subtitle: `${stats?.myCompletedGoals || 0} completed`,
          icon: EmojiEvents,
          color: 'primary',
          progress: stats?.myGoalProgress || 0,
        },
        {
          title: 'Reviews Received',
          value: stats?.reviewsReceived || 0,
          subtitle: 'This quarter',
          icon: Assessment,
          color: 'info',
        },
        {
          title: 'My Rating',
          value: stats?.myRating || '0.0',
          subtitle: 'Latest review',
          icon: Star,
          color: 'success',
        },
        {
          title: 'Performance Trend',
          value: stats?.performanceTrend || '+0%',
          subtitle: 'vs last quarter',
          icon: TrendingUp,
          color: stats?.performanceTrend?.startsWith('+') ? 'success' : 'error',
        },
      ];
    }
  };

  const statsData = getStatsForRole();

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;