// momoDepositRouter.js
import express from 'express';
import recordMoMoDeposit, { viewMoMoDeposits } from '../controllers/momoDeposits.controller.js';

const momoDepositsRouter = express.Router();

// Route to record a new MoMoDeposit
momoDepositsRouter.post('/record-momo-deposits', recordMoMoDeposit);
momoDepositsRouter.get('/momo-deposits', viewMoMoDeposits);

export default momoDepositsRouter;
