const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'vendor', phone, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role === 'admin' ? 'admin' : 'vendor',
      phone,
    });

    // If role is vendor, automatically create an associated initial Vendor document
    let vendorDoc = null;
    if (user.role === 'vendor') {
      vendorDoc = await Vendor.create({
        user: user._id,
        companyName: companyName || `${name}'s Company`,
        contactPerson: name,
        email: email.toLowerCase(),
        phone: phone || '',
        status: 'PENDING',
        onboardingStep: 1,
        onboardingCompleted: false,
      });

      user.vendorProfile = vendorDoc._id;
      await user.save();

      // Create welcome notification
      await Notification.create({
        recipient: user._id,
        title: 'Welcome to VENDORA!',
        message: 'Your supplier account has been registered. Please complete your onboarding application.',
        type: 'info',
        link: '/onboarding',
      });
    }

    const populatedUser = await User.findById(user._id).select('-password').populate('vendorProfile');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token: generateToken(user._id),
      user: populatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('vendorProfile');

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact admin.' });
      }

      res.json({
        success: true,
        message: 'Login successful',
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vendorProfile: user.vendorProfile,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('vendorProfile');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const populatedUser = await User.findById(updatedUser._id).select('-password').populate('vendorProfile');

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: populatedUser,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
