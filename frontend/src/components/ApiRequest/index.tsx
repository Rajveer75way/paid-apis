import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateApiRequestMutation } from "../../services/api-request"; // Assuming your mutation is defined here
import { useGetApisQuery } from "../../services/api-api"; // This is to fetch the APIs data
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // Import Framer Motion

// Validation schema for the form
const validationSchema = yup.object({
  module: yup.string().required("Module is required"),
  cost: yup
    .number()
    .required("Cost is required")
    .positive("Cost must be a positive number"),
});

const ApiRequestForm: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      module: "",
      cost: "",
    },
  });

  const { data: apiData, isLoading: isLoadingApis, isError: isErrorApis } = useGetApisQuery(); // Get API data from the server
  const [createApiRequest, { isLoading, isError, isSuccess }] = useCreateApiRequestMutation();

  const [selectedModule, setSelectedModule] = useState<string>("");
  const [cost, setCost] = useState<number>(0);

  const handleModuleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = event.target.value as string;
    setSelectedModule(selected);
    const selectedApi = apiData?.data.find((api) => api.module === selected);
    if (selectedApi) {
        console.log(selectedApi.price_per_request);
      setValue("cost", selectedApi.price_per_request); // Update the cost value in form
      setCost(Number(selectedApi.price_per_request));
    }
  };

  const onSubmit = useCallback(
    async (formData: any) => {
      try {
        // Find the API based on the selected module
        const selectedApi = apiData?.data.find((api) => api.module === formData.module);
        if (selectedApi) {
          await createApiRequest({
            apiId: selectedApi.api_id,
            cost: selectedApi.price_per_request,
          }).unwrap();
          toast.success('API Request Created Successfully!');
          reset(); // Reset the form on success
        }
      } catch (error) {
        console.log(error);
        toast.error(error.data.message);
      }
    },
    [createApiRequest, reset, apiData]
  );

  if (isLoadingApis) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorApis) {
    return (
      <Typography variant="h6" color="error" align="center">
        Failed to load APIs.
      </Typography>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }} // Smooth fade-in effect
    >
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Create API Request
        </Typography>

        {/* Form for creating a new API request */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Fade in the form smoothly
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.module}>
                <InputLabel>Module</InputLabel>
                <Controller
                  name="module"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Module"
                      onChange={(e) => {
                        field.onChange(e);
                        handleModuleChange(e);
                      }}
                    >
                      {apiData?.data.map((api) => (
                        <MenuItem key={api.api_id} value={api.module}>
                          {api.module}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.module?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Cost"
                value={cost}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }} // Button scale animation
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Create API Request"}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </motion.form>

        {/* Success or Error Message */}
        {isSuccess && (
          <Typography variant="h6" color="success.main" align="center">
            API Request Created Successfully!
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default ApiRequestForm;
