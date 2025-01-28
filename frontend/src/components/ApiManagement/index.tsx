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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetApisQuery, useCreateApiMutation } from "../../services/api-api";
import { useGetPlansQuery } from "../../services/plan-api"; // Import RTK query to get plans
import { toast } from "react-toastify";

// Validation schema for the form
const validationSchema = yup.object({
  api_name: yup.string().required("API name is required"),
  description: yup.string().required("Description is required"),
  planId: yup.string().required("Plan selection is required"),
  module: yup.string().required("Module is required"),
  price_per_request: yup.number().required("Price per request is required"),
  is_free: yup.boolean().required("Free status is required"),
});

const ApiManagement: React.FC = () => {
  const { data, isLoading, isError } = useGetApisQuery();
  const [createApi, { isLoading: isCreating }] = useCreateApiMutation();
  const { data: plans, isLoading: isLoadingPlans, isError: isErrorPlans } = useGetPlansQuery(); // Fetch plans

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      api_name: "",
      description: "",
      planId: "", // Initially empty
      module: "user", // Default module value
      price_per_request: 70, // Default price
      is_free: false, // Default free status
    },
  });

  const onSubmit = useCallback(
    async (formData: any) => {
      try {
        console.log("Form Data", formData); // Check if all fields are passed correctly
        await createApi(formData).unwrap();
        toast.success('API created successfully!'); // Show success toast
        reset(); // Clear the form after successful creation
      } catch (error) {
        toast.error(error.data.message); // Show error toast
      }
    },
    [createApi, reset]
  );

  // Accessing the API data from the response
  const apis = data?.data || [];

  const renderedApis = useMemo(() => {
    if (apis.length === 0) return <Typography>No APIs found.</Typography>;

    return apis.map((api) => (
      <Grid item xs={12} md={6} lg={4} key={api.api_id}>
        <Card>
          <CardContent>
            <Typography variant="h6">{api.api_name}</Typography>
            <Typography>Description: {api.description}</Typography>
            <Typography>Price per Request: ₹{api.price_per_request}</Typography>
            <Typography>Module: {api.module}</Typography>
            <Typography>Free API: {api.is_free ? "Yes" : "No"}</Typography>
            <Typography>Plan: {api.plan_name}</Typography> {/* Show plan name */}
          </CardContent>
        </Card>
      </Grid>
    ));
  }, [apis]);

  if (isLoading || isLoadingPlans) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || isErrorPlans) {
    return (
      <Typography variant="h6" color="error" align="center">
        Failed to load APIs or plans.
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage APIs
      </Typography>

      {/* Form for creating new APIs */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="api_name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="API Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
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

          {/* Module Field */}
          <Grid item xs={12} md={6}>
            <Controller
              name="module"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Module"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          {/* Price per Request Field */}
          <Grid item xs={12} md={6}>
            <Controller
              name="price_per_request"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Price per Request"
                  fullWidth
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          {/* Free Status Field */}
          <Grid item xs={12} md={6}>
            <Controller
              name="is_free"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  label="Is Free?"
                  fullWidth
                  error={!!fieldState.error}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{control.errors?.is_free?.message}</FormHelperText>
          </Grid>

          {/* Plan Select Dropdown */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!control.errors?.planId}>
              <InputLabel>Plan</InputLabel>
              <Controller
                name="planId"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    label="Plan"
                    onChange={(e) => field.onChange(e.target.value)} // Only update the planId
                  >
                    {plans?.data.map((plan) => (
                      <MenuItem key={plan.plan_id} value={plan.plan_id}>
                        {plan.plan_name} - ₹{plan.price_per_request}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{control.errors?.planId?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create API"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Display existing APIs */}
      <Typography variant="h5" gutterBottom>
        Existing APIs
      </Typography>
      <Grid container spacing={3}>
        {renderedApis}
      </Grid>
    </Box>
  );
};

export default ApiManagement;
