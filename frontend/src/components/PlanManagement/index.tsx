import React, { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetPlansQuery, useCreatePlanMutation } from "../../services/plan-api";
import { toast } from "react-toastify";

// Validation schema for the form
const validationSchema = yup.object({
  plan_name: yup.string().required("Plan name is required"),
  price_per_request: yup
    .number()
    .positive("Price per request must be positive")
    .required("Price per request is required"),
  free_requests: yup
    .number()
    .integer("Free requests must be an integer")
    .min(0, "Free requests cannot be negative")
    .required("Free requests are required"),
  description: yup.string().required("Description is required"),
});

const PlanManagement: React.FC = () => {
  // Fetching plans and creating new plans
  const { data, isLoading, isError } = useGetPlansQuery();
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      plan_name: "",
      price_per_request: "",
      free_requests: "",
      description: "",
    },
  });

  // Submit handler for creating a new plan
  const onSubmit = useCallback(
    async (formData: any) => {
      try {
        await createPlan(formData).unwrap();
        toast.success("Plan created successfully!");
        reset(); // Clear the form after successful creation
      } catch (error) {
        toast.error(error.data.message);
        console.error("Failed to create plan:", error);
      }
    },
    [createPlan, reset]
  );

  // Get the plans from the response and display them
  const plans = data?.data || []; // Accessing the actual array from the response

  const renderedPlans = useMemo(() => {
    if (plans.length === 0) return <Typography>No plans found.</Typography>;

    return plans.map((plan) => (
      <Grid item xs={12} md={6} lg={4} key={plan.plan_id}>
        <Card>
          <CardContent>
            <Typography variant="h6">{plan.plan_name}</Typography>
            <Typography>Price per request: ₹{plan.price_per_request}</Typography>
            <Typography>Free requests: {plan.free_requests}</Typography>
            <Typography>Description: {plan.description}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  }, [plans]);

  // Loading spinner while fetching data
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error message if fetching data fails
  if (isError) {
    return (
      <Typography variant="h6" color="error" align="center">
        Failed to load plans.
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Plans
      </Typography>

      {/* Form for creating new plans */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="plan_name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Plan Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="price_per_request"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Price Per Request"
                  type="number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="free_requests"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Free Requests"
                  type="number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Plan"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Display existing plans */}
      <Typography variant="h5" gutterBottom>
        Existing Plans
      </Typography>
      <Grid container spacing={3}>
        {renderedPlans}
      </Grid>
    </Box>
  );
};

export default PlanManagement;
