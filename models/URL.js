import mongoose from 'mongoose';
import moment from 'moment';

const getCurrentFormattedTime = () => {
    const date = new Date();
    const formattedHours = date.getHours() % 12 || 12;
    const formattedMinutes = String(date.getMinutes()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${formattedMinutes} ${period}`;
};

const URLSchema = new mongoose.Schema({
    fullUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    visits: { type: Number, default: 0 },
    createdAt: { type: String, default: getCurrentFormattedTime },
    expireAt: {
        type: String, default: function () {
            const createdAtDate = moment(this.createdAt, 'hh:mm A');
            const expireAtDate = createdAtDate.add(1, 'hour');
            return expireAtDate.format('hh:mm A');
        }
    },
});

const URL = mongoose.model('URL', URLSchema);

export default URL;
