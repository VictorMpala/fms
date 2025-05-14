/**
=========================================================
* Fleet Management System
=========================================================

* Fleet Management Dashboard
* Copyright 2025 Fleet Management System

* Developed by Fleet Management Team

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Google Maps Component
import GoogleMapsCard from "components/GoogleMapsCard";

import axios from "axios";
import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import Icon from "@mui/material/Icon";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  // State for sensor data
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    distance_cm: 0,
    mq3: 0,
    latitude: 0,
    longitude: 0,
  });

  // State for fuel level graph (bar chart) - keep last 10 readings
  const [fuelGraphData, setFuelGraphData] = useState({
    labels: Array(10).fill(""),
    datasets: { label: "Fuel Level", data: Array(10).fill(0) }
  });

  // State for temperature graph
  const [temperatureGraphData, setTemperatureGraphData] = useState({
    labels: Array(10).fill(""),
    datasets: { label: "Temperature", data: Array(10).fill(0) }
  });

  // State for alcohol level graph
  const [alcoholGraphData, setAlcoholGraphData] = useState({
    labels: Array(10).fill(""),
    datasets: { label: "Alcohol Level", data: Array(10).fill(0) }
  });

  // State for alerts
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await axios.get("http://13.51.175.120/api/latest-data/", { withCredentials: false });
        setSensorData(res.data);
        
        // Update fuel level graph with new reading
        setFuelGraphData(prev => ({
          labels: [...prev.labels.slice(1), new Date().toLocaleTimeString()],
          datasets: { ...prev.datasets, data: [...prev.datasets.data.slice(1), res.data.distance_cm || 0] }
        }));

        // Update temperature graph
        setTemperatureGraphData(prev => ({
          labels: [...prev.labels.slice(1), new Date().toLocaleTimeString()],
          datasets: { ...prev.datasets, data: [...prev.datasets.data.slice(1), res.data.temperature || 0] }
        }));

        // Update alcohol level graph
        setAlcoholGraphData(prev => ({
          labels: [...prev.labels.slice(1), new Date().toLocaleTimeString()],
          datasets: { ...prev.datasets, data: [...prev.datasets.data.slice(1), res.data.mq3 || 0] }
        }));

        // Check and create alerts
        const newAlerts = [];
        
        if (res.data.temperature > 45) {
          newAlerts.push({
            type: 'error',
            message: `High Temperature Alert: ${res.data.temperature}°C exceeds 45°C threshold`
          });
        }

        if (res.data.humidity > 90) {
          newAlerts.push({
            type: 'warning',
            message: `High Humidity Alert: ${res.data.humidity}% exceeds 90% threshold`
          });
        }

        if (res.data.distance_cm < 2) {
          newAlerts.push({
            type: 'error',
            message: `Proximity Alert: Distance ${res.data.distance_cm}cm is below 2cm threshold`
          });
        }

        if (res.data.mq3 > 5) {
          newAlerts.push({
            type: 'error',
            message: `Alcohol Level Alert: ${res.data.mq3} exceeds 5 threshold`
          });
        }

        // Update alerts, keeping only unique alerts
        setAlerts(prevAlerts => {
          const uniqueAlerts = [...prevAlerts, ...newAlerts].filter(
            (alert, index, self) => 
              index === self.findIndex((t) => t.message === alert.message)
          );
          return uniqueAlerts.slice(-5); // Keep only the last 5 alerts
        });
      } catch (err) {
        console.error('Sensor data fetch error:', err);
      }
    };
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout> 
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="water"
                title="Ultrasonic Sensor"
                count={sensorData.distance_cm}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="water"
                title="Temperature Reading"
                count={sensorData.temperature || 0}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="speed"
                title="Speed"
                count="0"
                // percentage={{
                //   color: "success",
                //   amount: "+1%",
                //   label: "than yesterday",
                // }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person"
                title="Alcohol Level"
                count={sensorData.mq3 || 0}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="fuel level graph"
                  description="Real-time ultrasonic sensor readings"
                  chart={fuelGraphData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Temperature Reading"
                  description="Real-time temperature data"
                  date="updated every second"
                  chart={temperatureGraphData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Alcohol Level"
                  description="Real-time alcohol sensor data"
                  date="updated every second"
                  chart={alcoholGraphData}
                />
              </MDBox>
</Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
            {alerts.length > 0 && (
              <Grid item xs={12}>
                <MDBox mb={3}>
                  <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    Alerts
                  </MDTypography>
                  {alerts.map((alert, index) => (
                    <MDAlert key={index} color={alert.type} dismissible>
                      <Icon fontSize="small" sx={{ mr: 1 }}>
                        {alert.type === 'error' ? 'warning' : 'info'}
                      </Icon>
                      {alert.message}
                    </MDAlert>
                  ))}
                </MDBox>
              </Grid>
            )}
            <Grid item xs={12} lg={8}>
              <GoogleMapsCard latitude={sensorData.latitude} longitude={sensorData.longitude} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
