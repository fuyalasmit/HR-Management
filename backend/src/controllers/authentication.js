const db = require("../../models");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const EmailService = require("../helper/emailServices");
const { createEmailContext } = require("../helper/utils");
const { validatePassword } = require("../helper/validation");
const message = require("../../constants/messages.json");

// Simple session storage (in production, use Redis or a proper session store)
const activeSessions = new Map();

// Generate session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create session
const createSession = (userEmail) => {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours
  
  activeSessions.set(sessionToken, {
    userEmail,
    expiresAt,
    createdAt: new Date()
  });
  
  return sessionToken;
};

// Validate session
const validateSession = (sessionToken) => {
  const session = activeSessions.get(sessionToken);
  if (!session) return null;
  
  if (new Date() > session.expiresAt) {
    activeSessions.delete(sessionToken);
    return null;
  }
  
  return session;
};

// Clean up expired sessions (call this periodically)
const cleanupExpiredSessions = () => {
  const now = new Date();
  for (const [token, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
  console.log(`Session cleanup completed. Active sessions: ${activeSessions.size}`);
};

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

const signup = async (req, res) => {
  try {
    const user = await db.appUser.create(req.body);
    // Save password in the passwordHistory table
    db.passwordHistory.create({
      userId: user.id,
      password: user.password,
      passwordCreatedAt: new Date(),
    });
    
    // Create session instead of JWT
    const sessionToken = createSession(user.email);
    
    res.status(201).json({ 
      user: user.email,
      sessionToken: sessionToken 
    });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: message.loginError });
    }
    // Check if the email exists
    const user = await db.appUser.findOne({
      where: { email: email.toLowerCase() },
    });
    if (user) {
      const auth = await bcrypt.compare(password, user.password); // Check if the password matched
      if (auth) {
        // Create session instead of JWT
        const sessionToken = createSession(user.email);
        
        return res.status(200).json({ 
          user: user.email,
          sessionToken: sessionToken 
        });
      }
    }
    return res.status(400).json({ error: message.loginError });
  } catch (err) {
    return res.status(400).json({ errors: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (sessionToken) {
      // Remove session from active sessions
      activeSessions.delete(sessionToken);
    }
    
    res.status(200).json({ message: "You've successfully logged out." });
  } catch (err) {
    res.status(200).json({ message: "You've successfully logged out." });
  }
};

// This api sends a password resetToken to user
const forgotPassword = async (req, res) => {
  try {
    // Get user based on the posted email
    const { email, frontendUrl } = req.body;
    const user = await db.appUser.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No account is associated with this email" });
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(64).toString("hex");
    // Hash resetToken
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 25); // 25 min from now

    // Send the plain resetToken to the user email and update user's passwordResetToken and passwordResetTokenExpiresAt in the database
    const resetUrl = `${frontendUrl}${resetToken}`;
    
   // console.log("\n\n\nPassword reset link:", resetUrl, "\n\n\n");

    user.set({
      passwordResetToken: hashedResetToken,
      passwordResetTokenExpiresAt: expiresAt,
    });
    await user.save();

    const context = await createEmailContext({ email, db });
    context.resetUrl = resetUrl;  
    const emailService = new EmailService();
    const messageId = await emailService.buildAndSendEmail(
      "resetpassword",
      context,
      email, // to be replaced with the receiver's email
      "Password change request" // Subject
    );
    console.log(`Email sent successfully! Message ID: ${messageId}`);

    res.status(200).json({
      status: "success",
      message: "password reset link sent to the user email",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message, //There is an error sending password reset email. Please try again later.
    });
  }
};

//This api enables unverified user to reset password
const resetPassword = async (req, res) => {
  //Hash the plain token
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //Find user based on the parameter token
  const user = await db.appUser.findOne({
    where: {
      passwordResetToken: token,
      passwordResetTokenExpiresAt: { [db.Sequelize.Op.gt]: Date.now() },
    },
  });
  if (!user) {
    // If user is null, the token is invalid or expired
    return res.status(400).json({
      error: message.invalidToken,
    });
  }

  const { password, confirmPassword } = req.body;

  // Check if password and confirmPassword matched
  if (password !== confirmPassword) {
    return res.status(400).json({
      passwordError: message.notMatched,
    });
  }

  //Check if password had been used before.
  const passwordHistory = await db.passwordHistory.findAll({
    where: { userId: user.id },
  });
  for (let history of passwordHistory) {
    const used = await bcrypt.compare(password, history.password); // Check if password matched any password already used by the user.
    if (used) {
      return res.status(400).json({
        error: message.usedPassword,
      });
    }
  }
  const now = new Date();

  //Update current password passwordChangedAt date.
  const currentPassword = await db.passwordHistory.findOne({
    where: {
      userId: user.id,
      password: user.password,
    },
  });

  if (currentPassword) {
    currentPassword.set({ passwordChangedAt: now });
    await currentPassword.save();
  }

  //Update user object
  user.set({
    password: password, //Reset password
    passwordChangedAt: now,
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
  });
  await user.save();

  // Save new password in the passwordHistory table
  db.passwordHistory.create({
    userId: user.id,
    password: user.password,
    passwordCreatedAt: now,
  });

  res.json({
    message: message.passwordChanged,
    user: user.email,
  });
};

// This api enables verified user to change password
const resetPasswordAuth = async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'] || req.headers['authorization']?.replace('Bearer ', '');
    const session = validateSession(sessionToken);
    
    if (!session) {
      return res.status(401).json({ error: message.sessionExpired });
    }
    
    const { password, newPassword, confirmNewPassword } = req.body;
    const user = await db.appUser.findOne({
      where: { email: session.userEmail },
    });
    
    if (!user) {
      // This is not expected to happen
      return res.status(404).json({ error: message.notFound });
    }
    
    const auth = await bcrypt.compare(password, user.password); // Check if the password matched
    if (!auth) {
      return res.status(400).json({ error: message.passwordError });
    }

    // Check if the new password is valid
    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        passwordError: passwordCheck.message,
      });
    }

    // Check if password and confirmPassword matched
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        error: message.notMatched,
      });
    }

    user.set({
      password: newPassword, //Reset password
      passwordChangedAt: new Date(),
    });

    await user.save();
    return res.status(200).json({ message: message.passwordChanged });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: message.sessionExpired });
  }
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  resetPasswordAuth,
  validateSession,
  createSession
};
