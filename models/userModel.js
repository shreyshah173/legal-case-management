const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['lawyer', 'client'], default: 'client' },
    access: { type: [String], default: [] }  // jo access chahiye uska name isme dalna hoga
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function addAccess(userId, accessRight) {  // name add karne ke liye function 
    try {
        await User.findByIdAndUpdate(userId, { $addToSet: { access: accessRight } });
        console.log(`Access right ${accessRight} added to user ${userId}`);
    } catch (error) {
        console.error("Error adding access right:", error);
    }
}

async function removeAccess(userId, accessRight) { // name remove karne ke liye function
    try {
        await User.findByIdAndUpdate(userId, { $pull: { access: accessRight } });
        console.log(`Access right ${accessRight} removed from user ${userId}`);
    } catch (error) {
        console.error("Error removing access right:", error);
    }
}

async function hasAccess(userId, accessRight) { // name check karne ke liye function 
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return false;
        }
        const hasAccess = user.access.includes(accessRight);
        console.log(`User ${userId} has access "${accessRight}": ${hasAccess}`);
        return hasAccess;
    } catch (error) {
        console.error("Error checking access right:", error);
        return false;
    }
}

module.exports = { User, addAccess, removeAccess, hasAccess };
