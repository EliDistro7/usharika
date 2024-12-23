const mongoose = require('mongoose');

const DependentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
});

const YomboUserSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String, // URL to the uploaded image
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => String(v).length >= 9 && String(v).length <= 15,
        message: "Phone number must be between 9 and 15 digits.",
      },
    },
    email: {
      type: String,
      required: false,
      match: [/.+@.+\..+/, "Please enter a valid email address."],
    },
    gender: {
      type: String,
      enum: ["me", "ke"], // Male, Female
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    birthPlace: {
      type: String,
      required: false,
    },
    maritalStatus: {
      type: String,
      enum: ["umeoa", "hujaoa", "umeolewa", "hujaolewa"],
      required: false,
    },
    marriageType: {
      type: String,
      enum: [
        "Ndoa ya Kikristo", // Christian Marriage
        "Ndoa ya Kiserikali", // Civil Marriage
        "Nyingineyo", // Other
        "bado",
      ],
      required: function () {
        return ["umeoa", "umeolewa"].includes(this.maritalStatus);
      },
    },
    dependents: [DependentSchema], // Array of dependent objects
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "msharika",
        "kiongozi_jumuiya",
        "mzee_kanisa",
        "umoja_vijana",
        "kiongozi_vijana",
        "kwaya_vijana",
        "praise_team",
        "kiongozi_praise_team",
        "kiongozi_kwaya_vijana",
        "kwaya_uinjilisti",
        "kiongozi_kwaya_uinjilsti",
        "umoja_wanaume",
        "kiongozi_umoja_wanaume",
        "umoja_wanawake",
        "kiongozi_umoja_wanawake",
        "wamama",
        "kiongozi_wamama",
        "wababa",
        "kiongozi_wababa",
      ],
      default: "msharika",
    },
    selectedRoles: {
      type: [String], // Array of strings
      default: ["msharika"],
    },
    kipaimara: {
      type: Boolean,
      default: false,
    },
    ubatizo: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    occupation: {
      type: String,
      required: true,
    },
    jumuiya: {
      type: String,
      enum: ["Malawi", "Kanisani", "Golani"],
      required: true,
    },
    matangazoNotifications: [
      {
        group: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          default: "matangazoNotification",
        },
      
        message: {
          type: String,
          required: true,
          trim: true,
        },
        status: {
          type: String,
          enum: ["read", "unread"], // Restrict to "read" or "unread"
          default: "unread", // Default status is "unread"
        },
        time: {
          type: Date,
          default: Date.now, // Automatically sets the current timestamp
        },
      },
    ],
    
    pledges: {
      ahadi: {
        type: Number,
        required: true,
      },
      paidAhadi: {
        type: Number,
        default: 0,
      },
      jengo: {
        type: Number,
        required: true,
      },
      paidJengo: {
        type: Number,
        default: 0,
      },
      other: {
        type: Map,
        of: {
          total: { type: Number, required: true },
          paid: { type: Number, default: 0 },
        },
        default: new Map(),
      },
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Ensure gender determines maritalStatus consistency
YomboUserSchema.pre("save", function (next) {
  if (this.gender === "me" && !["umeoa", "hujaoa"].includes(this.maritalStatus)) {
    return next(new Error("Invalid marital status for Male gender."));
  }

  if (this.gender === "ke" && !["umeolewa", "hujaolewa"].includes(this.maritalStatus)) {
    return next(new Error("Invalid marital status for Female gender."));
  }

  next();
});

const YomboUser = mongoose.model("YomboUser", YomboUserSchema);

module.exports = YomboUser;
