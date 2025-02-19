import dbConnect from '../../lib/dbConnect';
import Role from '../../models/Role';
import userModel, { IUser } from '../../models/user.models';
import { CustomError } from '../../utils/error';
import { SignUpSchema } from '../../zod_schemas/signUpSchema';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { error } from 'console';

export const SignUp1 = async (req: Request) => {
  // Connect to the database
  await dbConnect();

  // Parse the incoming request data
  const { username, role, password, email } = await req.json();
  const data = { username, role, password, email };
  console.log('email---', email)
  // Check for missing username or password
  if (!username || !password || !role) {
    throw new CustomError("Username, password and role are required", 400);
  }

  // Check if username already exists
  const user = await userModel.findOne({ username }).lean<IUser>() as IUser | null;;  // Correct typing for user
  console.log('user==', user)
  // const user: IUser | null = await userModel.findOne({ username });  // Proper typing for user
  // Validation function using Zod
  const validateSignUpData = async (signUpData) => {
    try {
      await SignUpSchema.parseAsync(signUpData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Extract and throw the validation error messages
        const errorMessages = err.errors.map((error) => ({
          field: error.path[0],
          message: error.message,
        }));
        throw new CustomError(JSON.stringify(errorMessages), 400);
      } else {
        throw new CustomError("Unexpected validation error", 500);
      }
    }
  };

  // Run the validation
  try {
    await validateSignUpData(data);
  } catch (error) {
    // Return the validation error in the response
    return new Response(JSON.stringify({ success: false, message: error.message, statusCode: 400 }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if email is already in use
  if (email) {
    const emailExists = await userModel.findOne({ email });  // Proper typing for email check
    console.log('emailExists===', emailExists)
    if (emailExists) {
      throw new CustomError("Email is already in use", 400);
    }
  }
  // If no user exists with the provided username, create a new user
  if (!user) {
    try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      console.log('username secPass role email', username,
        secPass,
        role,
        email,)
        console.log(typeof(role))
        const RoleObj = await Role.findOne({ name:role });  // Proper typing for email check
        console.log('roleId--', RoleObj._id)
      const newUser = new userModel({
        username,
        password:secPass,
        role:RoleObj._id,
        email,
      });
      const savedUser = await newUser.save();
      console.log('User saved successfully:', savedUser);

      // Return success response
      return new Response(
        JSON.stringify({ success: true, message: "User sign-up successful", statusCode: 200 }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      throw new CustomError("Error saving user"+error, 500);
    }
  }

  // If user already exists, return appropriate response
  return new Response(
    JSON.stringify({ success: false, message: "User already exists", statusCode: 400 }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const SignUp = async (req: Request) => {
  try {
    // Connect to the database
    await dbConnect();

    // Parse request body safely
    let username, role, password, email;
    try {
      ({ username, role, password, email } = await req.json());
    } catch (error) {
      throw new CustomError("Invalid request body", 400);
    }

    console.log('email---', email);

    // Validate required fields
    if (!username || !password || !role) {
      throw new CustomError("Username, password, and role are required", 400);
    }

    // Check if username or email already exists
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }]
    }).lean();

    if (existingUser) {
      if (existingUser.username === username) {
        throw new CustomError("Username is already taken", 400);
      }
      if (existingUser.email === email) {
        throw new CustomError("Email is already in use", 400);
      }
    }

    // Validate role existence
    const RoleObj = await Role.findOne({ name: role });
    if (!RoleObj) {
      throw new CustomError(`Role '${role}' not found`, 400);
    }
    console.log('RoleObj==',RoleObj)
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    console.log('Creating user:', { username, password: secPass, role, email });

    // Create new user
    const newUser = new userModel({
      username,
      password: secPass,
      role: RoleObj._id,
      email,
    });

    const savedUser = await newUser.save();
    console.log('User saved successfully:', savedUser);

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "User sign-up successful", statusCode: 200 }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Signup Error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message, statusCode: err.statusCode || 500 }),
      {
        status: err.statusCode || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};


export const Login = async (req: Request): Promise<Response> => {
  dbConnect()
  const { username, password } = await req.json();

  // Validate inputs
  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: 'Username and password are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Find the user by username and populate the role and permissions
  // Use aggregation pipeline to fetch user with role and permissions
  const users = await userModel.aggregate([
    { $match: { username } }, // Match user by username
    {
      $lookup: {
        from: 'roles', // Collection name for the Role model
        localField: 'role', // Field in the User collection
        foreignField: '_id', // Field in the Role collection
        as: 'roleData', // Output array field
      },
    },
    {
      $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true }, // Unwind roleData
    },
    {
      $lookup: {
        from: 'permissions', // Collection name for the Permission model
        localField: 'roleData.permissions', // Field in the Role collection
        foreignField: '_id', // Field in the Permission collection
        as: 'permissionsData', // Output array field
      },
    },
  ]);

  const user = users[0]; // Get the first (and ideally only) user

  // console.log('user==', user)
  if (!user) {
    return new Response(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check password validity
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Create a JWT payload with user information
  const payload = {
    id: user._id,
    username: user.username,
    role: user.roleData.name, // Ensure role is populated
    permissions: user.permissionsData.map((perm: any) => perm.name), // Extract permission names
  };

  // Generate the JWT token
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

  // Return success response with token and user info
  return new Response(
    JSON.stringify({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.roleData.name,
        permissions: user.permissionsData.map((perm: any) => perm.name),
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};


