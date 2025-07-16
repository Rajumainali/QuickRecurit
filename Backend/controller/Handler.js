const bcrypt = require("bcrypt");
const User = require("../model/loginSchema");
const RecruiterPost = require("../model/RecruiterPosts")
const jwt = require("jsonwebtoken");
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Incorrect Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const handleSignup = async (req, res) => {
  const { email, password, confirmPassword, role, details } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      details: details || null,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const CheckDetails = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.details && Object.keys(user.details).length > 0) {
      return res.json({ result: "yes" ,Details:user.details});
    } else {
      return res.json({ result: "no" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const AddDetails = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      designation,
      aboutMe,
      province,
      city,
      postalCode,
      currentAddress,
    } = req.body;

    const sectors = Array.isArray(req.body.sectors)
      ? req.body.sectors
      : Object.values(req.body).filter((_, key) => key.startsWith("sectors["));

    const profile = req.files?.profile?.[0]?.filename || null;
    const resume = req.files?.resume?.[0]?.filename || null;

    const details = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      designation,
      aboutMe,
      province,
      city,
      postalCode,
      currentAddress,
      sectors,
      profile, // filename saved in /upload/img/
      resume,  // filename saved in /upload/resume/
    };

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { details },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Details added successfully", details: user.details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const RecruiterAddDetails = async (req, res) => {
  try {
    const {
    CompanyName,
    RecuriterName,
    CompanyPhone,
    companyWebsite,
      designation,
      CompanyDescription,
      province,
      city,
      postalCode,
      currentAddress,
    } = req.body;

    const sectors = Array.isArray(req.body.sectors)
      ? req.body.sectors
      : Object.values(req.body).filter((_, key) => key.startsWith("sectors["));

    const logo = req.files?.logo?.[0]?.filename || null;
    const certificate = req.files?.certificate?.[0]?.filename || null;

    const details = {
     CompanyName,
    RecuriterName,
    CompanyPhone,
    companyWebsite,
      designation,
      CompanyDescription,
      province,
      city,
      postalCode,
      currentAddress,
      sectors,
      logo, // filename saved in /upload/logos/
      certificate,  // filename saved in /upload/certificates/
    };

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { details },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Details added successfully", details: user.details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const PostByRecruiter = async (req, res) => {
  try {
    const email = req.user.email;
    const postData = req.body;

    let recruiter = await RecruiterPost.findOne({ email });

    if (recruiter) {
      // Recruiter exists, add post to existing posts
      recruiter.posts.push(postData);
      await recruiter.save();
      return res.status(200).json({ message: "Post added successfully", post: recruiter.posts[recruiter.posts.length - 1] });
    } else {
      // First post by this recruiter
      const newRecruiter = new RecruiterPost({
        email,
        posts: [postData],
      });

      await newRecruiter.save();
      return res.status(201).json({ message: "First post created", post: newRecruiter.posts[0] });
    }

  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const GetAllPosts = async (req, res) => {
  try {
    const recruiters = await RecruiterPost.find({}, { 'posts.applicants': 0 });

    const allPosts = [];

    for (const recruiter of recruiters) {
      const user = await User.findOne({ email: recruiter.email });

      const companyName = user?.details?.CompanyName || "Unknown Company";
      const logo = user?.details?.logo || "No logo";

      recruiter.posts.forEach(post => {
        const postObj = post.toObject();
        delete postObj._id; // Remove the post's _id

        allPosts.push({
          ...postObj,
          recruiterEmail: recruiter.email,
          companyName,
          logo
        });
      });
    }

    res.status(200).json({ posts: allPosts });
  } catch (err) {
    console.error("Fetch all posts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = {
  handleLogin,
  handleSignup,
  CheckDetails,
  AddDetails,
  RecruiterAddDetails,
  PostByRecruiter,
  GetAllPosts
};
