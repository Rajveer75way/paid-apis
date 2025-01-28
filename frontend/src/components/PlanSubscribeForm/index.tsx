import React, { useCallback } from 'react';
import { Box, Button, CircularProgress, Grid, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetPlansQuery } from '../../services/plan-api'; // Import RTK queries
import { useSubscribeMutation } from '../../services/user-api'; // Import RTK mutations
import { toast } from 'react-toastify';

// Validation schema for the form
const validationSchema = yup.object({
  plan: yup.string().required('Plan selection is required'),
});

const SubscribePlanForm = () => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { data: plans, isLoading: loadingPlans, isError: plansError } = useGetPlansQuery();
  const [subscribe, { isLoading: isSubscribing, isError: subscribeError, isSuccess: subscribeSuccess }] = useSubscribeMutation();

  const onSubmit = useCallback(
    async (data) => {
      try {
        // Call the subscribe mutation with the selected plan ID
        await subscribe(data.plan).unwrap();
        toast.success('Subscription successful');
        reset(); // Reset form after successful subscription
      } catch (error) {
        toast.error(error.data.message);
        console.error('Subscription failed', error);
      }
    },
    [subscribe, reset]
  );

  // Show loading spinner while plans are being fetched
  if (loadingPlans) {
    return <CircularProgress />;
  }

  // Show error message if there was an issue fetching plans
  if (plansError) {
    return <Typography color="error">Failed to load plans.</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Subscribe to a Plan
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.plan}>
              <InputLabel>Plan</InputLabel>
              <Controller
                name="plan"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Plan">
                    {/* Loop through the fetched plans and display each one in the dropdown */}
                    {plans?.data.map((plan) => (
                      <MenuItem key={plan.plan_id} value={plan.plan_id}>
                        {/* Show plan name and price per request */}
                        {plan.plan_name} -₹{plan.price_per_request}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.plan?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Success message after successful subscription */}
      
    </Box>
  );
};

export default SubscribePlanForm;
