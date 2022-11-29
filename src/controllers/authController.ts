import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AccessToken } from "../models/AccessToken";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Regex to check if username is valid (alphanumeric, 3-20 characters)
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  if (!usernameRegex.test(username))
    return res
      .status(400)
      .json({ message: "Username must be 3-20 alphanumeric characters" });

  // Regex to check if password is strong enough (at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and at least 8 characters long)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password))
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    });

  try {
    const userRepository = AppDataSource.getRepository(User);

    // Check if username is already taken
    if (await userRepository.findOne({ where: { username } }))
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;

    await userRepository.save(user);

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { username } });

  // Check if user exists
  if (!user) return res.status(400).json({ message: "User not found" });

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" });

  // Generate access token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  // Save token to database
  const accessTokenRepository = AppDataSource.getRepository(AccessToken);
  const accessToken = new AccessToken();
  accessToken.token = token;
  accessToken.user = user;
  accessToken.tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await accessTokenRepository.save(accessToken);

  return res.status(200).json({ token });
};
