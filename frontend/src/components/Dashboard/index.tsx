import { useGetUserDashboardQuery } from "../../services/user-api";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import PlanManagement from "../PlanManagement";
import ApiManagement from "../ApiManagement";
import ApiRequestForm from "../ApiRequest";

const UserDashboard = () => {
  const { data, isLoading, isError } = useGetUserDashboardQuery(null);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          Failed to load dashboard. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <>
    
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        ADMIN Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        List of Users
      </Typography>
      <Grid container spacing={3}>
        {data.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Balance: ₹{parseFloat(user.balance).toFixed(2)}</Typography>
                <Typography>Plan: {user.plan}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    <PlanManagement />
    <ApiManagement />
    {/* <ApiRequestForm /> */}
    </>
  );
};

export default UserDashboard;
