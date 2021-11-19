import './css/App.css';
import { getProvince, getDistrict, getWard, getService, calculateTheExpectedDeliveryTime } from './api';
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import LoadingButton from '@mui/lab/LoadingButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


function App() {
  const [loading, setLoading] = React.useState(true)
  const [provinces, setProvinces] = React.useState([])
  const [fromProvince, setFromProvince] = React.useState('');
  const [toProvince, setToProvince] = React.useState('');
  const [fromDistricts, setFromDistricts] = React.useState([]);
  const [toDistricts, setToDistricts] = React.useState([]);
  const [fromDistrict, setFromDistrict] = React.useState('');
  const [toDistrict, setToDistrict] = React.useState('');
  const [fromWards, setFromWards] = React.useState([]);
  const [toWards, setToWards] = React.useState([]);
  const [fromWard, setFromWard] = React.useState('');
  const [toWard, setToWard] = React.useState('');
  const [services, setServices] = React.useState([]);
  const [service, setService] = React.useState('');
  const [disabledField, setDisabledField] = React.useState(true);
  const [calculating, setCalculating] = React.useState(false);
  const [leadtime, setLeadtime] = React.useState(0);

  const handleChangeService = (event) => {
    setService(event.target.value);
  }

  const handleChangeProvince = async (event, type) => {
    if (type === 'from') {
      setFromWard('')
      setFromProvince(event.target.value);
      setLoading(true)
      getAllDistrict(event.target.value, type)
      setLoading(false)
    }
    if (type === 'to') {
      setToWard('')
      setToProvince(event.target.value);
      setLoading(true)
      getAllDistrict(event.target.value, type)
      setLoading(false)
    }
  };

  const handleChangeDistrict = async (event, type) => {
    if (type === 'from') {
      setFromDistrict(event.target.value);
      setLoading(true)
      getAllWard(event.target.value, type)
      setLoading(false)
    }
    if (type === 'to') {
      setToDistrict(event.target.value);
      setLoading(true)
      getAllWard(event.target.value, type)
      setLoading(false)
    }
  };

  const handleChangeWard = async (event, type) => {
    setService('')
    if (type === 'from') {
      setFromWard(event.target.value, type);
    }
    if (type === 'to') {
      setToWard(event.target.value, type);
    }
  };

  const getAllDistrict = (provinceId, type) => {
    getDistrict(provinceId).then(value => {
      if (type === 'from') {
        setFromDistrict('')
        setFromDistricts(value)
      }
      if (type === 'to') {
        setToDistrict('')
        setToDistricts(value)
      }
      //setDistrict(value[0].DistrictID)
    })
  }

  const getAllWard = (districtId, type) => {
    getWard(districtId).then(value => {
      if (type === 'from') {
        setFromWard('')
        setFromWards(value)
      }
      if (type === 'to') {
        setToWard('')
        setToWards(value)
      }
      //setWard(value[0].WardCode)
    })
  }

  const getServiceName = (from, to) => {
    getService(83179, from, to).then(value => {
      setServices(value)
    })
  }

  const handleCalculatingTheExpectedDeliveryTime = async () => {
    setCalculating(true)
    calculateTheExpectedDeliveryTime(fromDistrict, fromWard, toDistrict, toWard, service).then(value => {
      console.log(value)

      var hDisplay = new Date(value.leadtime).getHours();
      var mDisplay = new Date(value.leadtime).getMinutes();
      var sDisplay = new Date(value.leadtime).getSeconds();
      const finalTime = hDisplay + 'h:' + mDisplay + 'm:' + sDisplay + 's';
      setLeadtime(finalTime)
      setCalculating(false)
    })
  }

  React.useEffect(() => {
    getProvince().then(value => {
      if (loading) {
        setProvinces(value)
        //setProvince(value[0].ProvinceID)
      }
      setLoading(false)
    })

    if (toWard !== '' && fromWard !== '') {
      getServiceName(fromDistrict, toDistrict)

      if (service !== '') {
        setDisabledField(false)
      }
      else {
        setDisabledField(true)
      }
    }
    else {
      setDisabledField(true)
    }

  }, [loading, toWard, fromWard, fromDistrict, toDistrict, service]);

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '80%', maxWidth: 800, margin: 'auto', marginTop: '50px' }}>
      <Typography style={{ marginBottom: '30px' }} variant="h4" component="h5">
        Calculate the expected delivery time
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid style={{ marginBottom: '20px' }} item xs={12}>
          <Divider textAlign="left">
            <Chip label="From location" />
          </Divider>
        </Grid>

        <Grid item xs={4}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select your province"
            value={fromProvince}
            onChange={(event) => handleChangeProvince(event, 'from')}
            helperText="Please select your province"
          >
            {provinces.map((option) => (
              <MenuItem key={option.ProvinceID} value={option.ProvinceID}>
                {option.ProvinceName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select your district"
            value={fromDistrict}
            onChange={(event) => handleChangeDistrict(event, 'from')}
            helperText="Please select your district"
          >
            {fromDistricts.map((option) => (
              <MenuItem key={option.DistrictID} value={option.DistrictID}>
                {option.DistrictName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select your ward"
            value={fromWard}
            onChange={(event) => handleChangeWard(event, 'from')}
            helperText="Please select your ward"
          >
            {fromWards.map((option) => (
              <MenuItem key={option.WardCode} value={option.WardCode}>
                {option.WardName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid style={{ marginBottom: '20px', marginTop: '20px' }} item xs={12}>
          <Divider textAlign="left">
            <Chip label="To location" />
          </Divider>
        </Grid>


        <Grid item xs={4}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select your province"
            value={toProvince}
            onChange={(event) => handleChangeProvince(event, 'to')}
            helperText="Please select your province"
          >
            {provinces.map((option) => (
              <MenuItem key={option.ProvinceID} value={option.ProvinceID}>
                {option.ProvinceName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select your district"
            value={toDistrict}
            onChange={(event) => handleChangeDistrict(event, 'to')}
            helperText="Please select your district"
          >
            {toDistricts.map((option) => (
              <MenuItem key={option.DistrictID} value={option.DistrictID}>
                {option.DistrictName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select your ward"
            value={toWard}
            onChange={(event) => handleChangeWard(event, 'to')}
            helperText="Please select your ward"
          >
            {toWards.map((option) => (
              <MenuItem key={option.WardCode} value={option.WardCode}>
                {option.WardName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid style={{ marginBottom: '20px', marginTop: '20px' }} item xs={12}>
          <Divider textAlign="left">
            <Chip label="Services" />
          </Divider>
        </Grid>

        <Grid item xs={4}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select service"
            value={service}
            onChange={handleChangeService}
            helperText="Please select service"
          >
            {services.map((option) => {
              if (option.short_name !== '') {
                return (
                  <MenuItem key={option.service_id} value={option.service_id}>
                    {option.short_name}
                  </MenuItem>
                )
              }
              return (
                <MenuItem key={option.service_id} value={option.service_id}>
                  Tiêu chuẩn
                </MenuItem>
              )
            })}
          </TextField>
        </Grid>
        <Grid style={{ marginBottom: '20px', marginTop: '20px' }} item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={9}>
          {leadtime}
        </Grid>

        <Grid item xs={3}>
          <LoadingButton
            disabled={disabledField}
            loading={calculating}
            loadingPosition="start"
            startIcon={<AccessTimeIcon />}
            variant="outlined"
            onClick={handleCalculatingTheExpectedDeliveryTime}
          >
            Calculate
          </LoadingButton>
        </Grid>

      </Grid>
    </Box>
  );
}

export default App;
