import React, { useState } from 'react';
import BikeSelector from './BikeSelector';
import FinancialReportView from './FinancialReport';


const FinancialReportsPage = () => {
  const [selectedBike, setSelectedBike] = useState(null);

  return (
    <div>
     
      <BikeSelector onSelectBike={setSelectedBike} />
      {selectedBike && <FinancialReportView selectedBike={selectedBike} />}
    </div>
  );
};

export default FinancialReportsPage;
