import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import HospitalGrid from '../components/hospital/HospitalGrid';
import UserGuide from '../components/guide/UserGuide';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const Home = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    fetchHospitals(1);
  }, []);
  
  const fetchHospitals = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/hospitals`, {
        params: {
          page: pageNum,
          limit: 12
        }
      });
      
      setHospitals(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hospitals. Please try again later.');
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (event, value) => {
    fetchHospitals(value);
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            color: '#1a237e',
            mb: 4
          }}
        >
          Hospital Management System
        </Typography>

        {/* User Guide Section - Only shown to non-logged-in users */}
        {!user && <UserGuide />}

        {/* Hospitals Grid */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ mb: 3, color: '#1a237e' }}
        >
          Available Hospitals
        </Typography>
        
        <HospitalGrid
          hospitals={hospitals}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default Home; 