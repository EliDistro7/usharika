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
        message: "Namba ya Simu inatakiwa iwe na idadi ya tarakimu kati ya 9 na 15.",
      },
    },
    email: {
      type: String,
      required: false,
      match: [/.+@.+\..+/, "Tafadhali ingiza Email sahihi."],
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
      enum:   [
        "msharika",
        "kiongozi_jumuiya",
        
        "umoja_wa_vijana",
        "kiongozi_umoja_wa_vijana",
      
        "kwaya_ya_umoja_wa_vijana",
        "kiongozi_kwaya_ya_umoja_wa_vijana",
      
        "kwaya_kuu",
        "kiongozi_kwaya_kuu",
      
        "kwaya_ya_wamama",
        "kiongozi_kwaya_ya_wamama",
      
        "kwaya_ya_vijana",
        "kiongozi_kwaya_ya_vijana",
      
        "praise_team",
        "kiongozi_praise_team",
      
        "kwaya_ya_uinjilisti",
        "kiongozi_kwaya_ya_uinjilsti",
      
        "wababa_kati",
        "kiongozi_wababa_kati",
        
        "umoja_wa_wanaume",
        "kiongozi_umoja_wa_wanaume",
      
        "baraza_la_wazee",
        "kiongozi_baraza_la_wazee",
       
        "umoja_wa_wanawake",
        "kiongozi_umoja_wa_wanawake",
      
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
        pinned: {
          type: Boolean,
          default: false
        },
      },
    ],

    donations: [
      {
        name: {
          type: String,
          required: true, // Name of the donation or purpose is required
          trim: true,
        },
        group: {
          type:String,
        required: true,
        trim: true
        },
        
        details: {
          type: String,
          required: true, // Details about the donation are required
          trim: true,
        },
        startingDate: {
          type: Date,
          required: true, // A starting date for collecting donations is required
        },
        deadline: {
          type: Date,
          required: true, // Deadline for collecting donations is required
        },
        amountPaid: {
          type: Number,
          default: 0, // Default amount paid is 0
          min: 0, // Prevent negative values
        },
        total: {
          type: Number,
          default: 0, // Default amount paid is 0
          min: 0, // Prevent negative values
        },
        createdAt: {
          type: Date,
          default: Date.now, // Automatically sets the timestamp when the field is created
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
