import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';



import { MotorbikeProvider } from './pages/reports-new/allreports/MotorBikeContext';

import AllEmployeesReport from './pages/HumanResource/EmployeeList';
import AllPayrollsReport from './pages/HumanResource/PayRoll';
import ExpenseReportViewer from './pages/reports-new/allreports/expenseReports/AllExpenseReportNew';
import IncomeReportViewer from './pages/reports-new/allreports/AllIncomeReport';
import ProfitLossReportViewer from './pages/reports-new/ProfitLossReportByBike';



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
           
            
           
            <Route path='/expense-reports' element={<ExpenseReportViewer />} />
            <Route path='/income-reports' element={<IncomeReportViewer />} />
           
           
           
    
            <Route path='/employee-list' element={<AllEmployeesReport/>} />
            <Route path='/payrolls' element={<AllPayrollsReport/>} />
            <Route path='/motor-profit-loss-reports' element={<ProfitLossReportViewer/>} />
          </Route>
        </Routes>
      </MotorbikeProvider>
    </BrowserRouter>
  );
}
