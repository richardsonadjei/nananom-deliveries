// momoDepositController.js
import MoMoDeposit from '../models/momoDeposit.model.js';

// Controller to record a new MoMoDeposit
const recordMoMoDeposit = async (req, res) => {
    try {
      // Extract data from the request body
      const { depositAmount, description, recordedBy, date } = req.body;
  
      // Create a new MoMoDeposit document
      const newMoMoDeposit = new MoMoDeposit({
        depositAmount,
        description,
        recordedBy,
        date: date || new Date(), // Use the provided date or default to the current date
      });
  
      // Save the MoMoDeposit document to the database
      await newMoMoDeposit.save();
  
      // Return success response
      return res.status(201).json({ success: true, message: 'MoMoDeposit recorded successfully', data: newMoMoDeposit });
    } catch (error) {
      // Handle errors
      console.error('Error recording MoMoDeposit:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  export default recordMoMoDeposit;
  



// Controller to view all MoMo deposits within a particular period
export const viewMoMoDeposits = async (req, res) => {
  try {
    // Extract startDate and endDate from the request query
    const { startDate, endDate } = req.query;

    // Parse startDate and endDate strings into Date objects in UTC format
    const parsedStartDate = new Date(startDate + 'T00:00:00Z'); // Assuming startDate is in YYYY-MM-DD format
    const parsedEndDate = new Date(endDate + 'T23:59:59.999Z'); // Assuming endDate is in YYYY-MM-DD format

    // Fetch MoMo deposits within the specified period
    const momoDeposits = await MoMoDeposit.find({
      date: { $gte: parsedStartDate, $lte: parsedEndDate },
    });

    // Return success response with the retrieved MoMo deposits
    return res.status(200).json({ success: true, data: momoDeposits });
  } catch (error) {
    // Handle errors
    console.error('Error fetching MoMo deposits:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
