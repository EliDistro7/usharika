


const mongoose= require('mongoose');

const { Schema } = mongoose;

// Define the Attendance schema
const attendanceSchema = new Schema(
  {
    group: {
      type: String,
      required: true,
      enum: [
        "admin",
        "msharika",
        "kiongozi_jumuiya",
        "mzee_kanisa",
        "vijana",
        "kiongozi_vijana",
        "kwaya_vijana",
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
      ], // Predefined role groups
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // Automatically set to the current date
    },
    session_name: {
      type: String,
      required: true,
      trim: true,
    },
    attendees: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "YomboUser", // Reference to the User model
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports= Attendance;
