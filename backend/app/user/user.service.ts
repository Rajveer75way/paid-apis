import { type IUser } from "./user.dto";
import { AppDataSource } from '../common/services/database.service'; // Import AppDataSource to access your TypeORM repositories
import { User } from "./user.schema";  // Assuming User is the TypeORM entity
import { createUserTokens } from "../common/services/passport-jwt.service"; // Import the token creation function
import { compare } from "bcrypt"; // Ensure you import compare from bcrypt
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Between } from "typeorm";
import jwt from "jsonwebtoken";
/**
 * Create a new user, save the user to the database, and send a welcome email.
 * 
 * @param {IUser} data - The user data to be created.
 * @returns {Promise<IUser>} The created user object without the password field.
 * @throws {Error} Throws an error if user creation or email sending fails.
 */
export const createUser = async (data: IUser) => {
  if (!data.name || !data.email || !data.password || !data.role) {
    throw new Error("Missing required fields: name, email, password, or role");
  }
  const userRepository = AppDataSource.getRepository(User);
  // Create the user and set active to true
  const user = userRepository.create({ ...data, active: true });
  await userRepository.save(user);
  console.log(data);

  return user;
};


/**
 * Get the count of active users in the database.
 * 
 * @returns {Promise<number>} The count of active users.
 * @throws {Error} Throws an error if fetching the count fails.
 */
export const getActiveUserCount = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const activeUserCount = await userRepository.count({ where: { active: true } });
    return activeUserCount;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching active user count");
  }
};

/**
 * Get all users in the database.
 * 
 * @returns {Promise<IUser[]>} List of all users.
 */
export const getAllTasks = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const result = await userRepository.find();
  return result;
};

/**
 * Log in a user by verifying email and password, and return user data with tokens.
 * 
 * @param {Object} data - Object containing user email and password.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The password of the user.
 * @returns {Promise<Object>} A success message, user data, and generated tokens.
 * @throws {Error} Throws an error if user not found or password is invalid.
 */
export const loginUser = async (data: { email: string; password: string }) => {
  const userRepository = AppDataSource.getRepository(User);

  // Find user by email
  const user = await userRepository.findOne({ where: { email: data.email } });
  if (!user) {
    throw new Error("User not found");
  }

  // Validate password
  const isPasswordValid = await compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Define the IUser interface
  interface IUser {
    _id: string; // Using id for TypeORM
    name: string;
    email: string;
    active: boolean;
    role: "USER" | "ADMIN";
    password: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken?: string; // Remove `null` to match expected type
  }

  // Exclude the password field
  type IUserWithoutPassword = Omit<IUser, "password">;

  const userWithoutPassword: IUserWithoutPassword = {
    _id: user.id,
    name: user.name,
    email: user.email,
    active: user.active,
    role: user.role as "USER" | "ADMIN", // Cast the role if needed
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    refreshToken: user.refreshToken ?? undefined, // Handle null by converting it to undefined
  };

  // Generate tokens
  const tokens = createUserTokens(userWithoutPassword);

  // Save the refresh token to the user's entity
  user.refreshToken = tokens.refreshToken;
  await userRepository.save(user);

  return {
    success: true,
    message: "User logged in",
    data: {
      user: userWithoutPassword,
      tokens,
    },
  };
};


/**
 * Update a user's password and send an email notification.
 * 
 * @param {Object} data - Object containing the email and new password.
 * @param {string} data.email - The email of the user.
 * @param {string} data.password - The new password of the user.
 * @returns {Promise<IUser>} The updated user object without the password field.
 * @throws {Error} Throws an error if the user is not found or password update fails.
 */
export const createUpdatePassword = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  await userRepository.save(user);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password Update Notification",
    text: `Hello ${user.name},\n\nYour password has been successfully updated. If you did not initiate this change, please contact support immediately.\n\nBest regards,\nTeam`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Password update email sent to:", user.email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
  return user;
};

/**
 * Block or unblock a user by updating their blocked status.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {boolean} block - Whether to block or unblock the user.
 * @returns {Promise<IUser>} The updated user object without the password field.
 * @throws {Error} Throws an error if the user is not found.
 */


/**
 * Get the number of users who registered within a specific date range.
 * 
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Promise<number>} The count of registered users.
 */
export const getRegisteredUsersByDateRange = async (startDate: Date, endDate: Date) => {
  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.count({
    where: {
      createdAt: Between(startDate, endDate),
    },
  });
  return users;
};

/**
 * Update a user's information.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {IUser} data - The new data for the user.
 * @returns {Promise<IUser>} The updated user object.
 */
export const updateUser = async (id: string, data: IUser) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Ensure the id is of the correct type (string in this case)
    const user = await userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new Error("User not found");
    }

    // Update the user with the new data
    Object.assign(user, data);
    
    // Save the updated user
    await userRepository.save(user);
    
    // Return the updated user
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

/**
 * Edit a user's information partially.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {Partial<IUser>} data - The new data for the user (partial update).
 * @returns {Promise<IUser>} The updated user object.
 */
export const editUser = async (id: string, data: Partial<IUser>) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  Object.assign(user, data);
  await userRepository.save(user);
  return user;
};

/**
 * Delete a user from the database.
 * 
 * @param {string} id - The ID of the user to be deleted.
 * @returns {Promise<Object>} The result of the delete operation.
 */
export const deleteUser = async (id: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const result = await userRepository.delete(id);
  return result;
};

/**
 * Get a user by their ID.
 * 
 * @param {string} id - The ID of the user to be retrieved.
 * @returns {Promise<IUser>} The user object.
 */
export const getUserById = async (id: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const result = await userRepository.findOne({ where: { id } });
  return result;
};

/**
 * Get all users in the database.
 * 
 * @returns {Promise<IUser[]>} A list of all users.
 */
export const getAllUser = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const result = await userRepository.find();
  return result;
};

/**
 * Get a user by their email.
 * 
 * @param {string} email - The email of the user to be retrieved.
 * @returns {Promise<IUser | null>} The user object or null if not found.
 */
export const getUserByEmail = async (email: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const result = await userRepository.findOne({ where: { email } });
  return result;
};
export const refreshToken = async (refreshToken: string) => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET ?? "";
  
  // Decode the refresh token
  const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as { id: string };
  const userRepository = AppDataSource.getRepository(User);

  // Find the user by ID
  const user = await userRepository.findOne({ where: { id: decoded.id } });
  if (!user) {
    throw new Error("User not found");
  }
  console.log(user.refreshToken, refreshToken);
  console.log(user);
  // Validate the refresh token
  if (user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  // Create a new set of tokens without the password field
  const userWithoutPassword = {
    _id: user.id,
    name: user.name,
    email: user.email,
    active: user.active,
    role: user.role as "USER" | "ADMIN", // Cast the role if necessary
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const tokens = createUserTokens(userWithoutPassword);

  // Save the new refresh token
  user.refreshToken = tokens.refreshToken;
  await userRepository.save(user);

  return {
    user: userWithoutPassword,
    tokens,
  };
};