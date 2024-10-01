import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import RecordSales from './pages/RecordSales';
import BuyFuel from './pages/BuyFuel';
import RecordMaintenance from './pages/RecordMaintenance';
import RecordOtherExpense from './pages/RecordOtherExpense';
import FuelReport from './pages/reports/FuelReport';
import MaintenanceReport from './pages/reports/MaintenanceReport';
import OtherExpenseReport from './pages/reports/OtherExpenseReport';
import ProfitLossReport from './pages/reports/ProfitLossReport';
import DailySalesReport from './pages/reports/DailySalesReport';
import MoMoDeposit from './pages/MomoDeposit';
import MomoDepositReport from './pages/reports/MomoDepositReport';
import ReportsDashboard from './pages/reports-new/FinancialReport';
import AllIncome from './pages/reports-new/allreports/AllIncomeReport';
import IncomeByPeriod from './pages/reports-new/allreports/IncomeByPeriod';
import { MotorbikeProvider } from './pages/reports-new/allreports/MotorBikeContext';
import AllExpenseReport from './pages/reports-new/allreports/expenseReports/AllExpenseReport';
import ExpenseByPeriod from './pages/reports-new/allreports/expenseReports/ExpenseByPeriod';


export default function App() {
  return (
    <BrowserRouter>
      <MotorbikeProvider> {/* Wrap the Routes with the MotorbikeProvider */}
        <Header />
        <Routes>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-out' element={<SignOut />} />
          <Route element={<PrivateRoute />}>
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/' element={<Home />} />
            <Route path='/record-daily-sales' element={<RecordSales />} />
            <Route path='/buy-fuel' element={<BuyFuel />} />
            <Route path='/record-maintenance' element={<RecordMaintenance />} />
            <Route path='/record-other-expense' element={<RecordOtherExpense />} />
            <Route path='/fuel-reports' element={<FuelReport />} />
            <Route path='/maintenance-reports' element={<MaintenanceReport />} />
            <Route path='/other-expense-reports' element={<OtherExpenseReport />} />
            <Route path='/profit-loss-reports' element={<ProfitLossReport />} />
            <Route path='/daily-sales-report' element={<DailySalesReport />} />
            <Route path='/add-momo-deposits' element={<MoMoDeposit />} />
            <Route path='/momo-deposits' element={<MomoDepositReport />} />
            <Route path='/reports' element={<ReportsDashboard />} />
            <Route path='/all-bike-income' element={<AllIncome />} />
            <Route path='/all-bike-income-by-period' element={<IncomeByPeriod />} />
            <Route path='/all-bike-expense' element={<AllExpenseReport/>} />
            <Route path='/all-bike-expense-by-period' element={<ExpenseByPeriod/>} />
          </Route>
        </Routes>
      </MotorbikeProvider>
    </BrowserRouter>
  );
}
