import React, { useEffect, useState } from 'react'
import { fetchEmployees } from './employeesService';
import TableGrid from '../../components/Table/TableGrid';

const EmployeeInfor = () => {
  const [employee, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees(setEmployees, setLoading);
  }, [])
  if(loading) return <div>Loading</div>
  return (
    <>
      <div><TableGrid data={employee} /></div>
    </>
  )
}

export default EmployeeInfor