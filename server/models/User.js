const { Schema, model, ObjectId } = require("mongoose");

const User = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    diskSpace: { type: Number, default: 1024 ** 3 * 10 },
    usedSpace: { type: Number, default: 0 },
    avatar: { type: String },
    files: [{ type: ObjectId, ref: "File" }],
    verificationCode: { type: String },
    isActivated: { type: Boolean, default: false },
    resetPasswordCode: { type: String },
});

module.exports = model("User", User);
