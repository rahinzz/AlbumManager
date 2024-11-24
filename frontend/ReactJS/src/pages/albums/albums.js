// material-ui
// project import
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { useEffect } from 'react';
import { useState } from 'react';
import { fetchGetDataWithAuth } from 'client/client';
import { makeStyles } from '../../../node_modules/@mui/styles/index';
import { Card, Grid } from '../../../node_modules/@mui/material/index';
import { CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const brightPopColors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFD633",
  "#33FFF5", "#FF33F5", "#F5FF33", "#FF9633", "#33FF8D",
  "#FF3333", "#33A1FF", "#9B33FF", "#FF33D4", "#33FFB0",
  "#FFC733", "#338FFF", "#FF7D33", "#33FFCC", "#E833FF",
  "#FF6F61", "#6BFF61", "#6176FF", "#FF619B", "#FFE161",
  "#61FFF1", "#FF61E6", "#E6FF61", "#FFB461", "#61FFB6",
  "#FF6161", "#6194FF", "#A161FF", "#FF61D0", "#61FFC5",
  "#FFD461", "#619EFF", "#FF9361", "#61FFD6", "#E861FF",
  "#FF8561", "#61FF85", "#616CFF", "#FF6185", "#FFF161",
  "#61EFFF", "#FF61FB", "#FBFF61", "#FF9F61", "#61FF9F"
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * brightPopColors.length);
  return brightPopColors[randomIndex];
}

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor : getRandomColor(),
    textAlign : 'center',
    padding : theme.spacing(3),
    borderRadius : theme.spacing(2),
    height : '250px', 
    display : 'flex',
    flexDirection : 'column',
    justifyContent : 'center',
  },
}));

const AlbumDynamicGridPage = () => {
  const [dataArray, setDataArray] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if(!isLoggedIn){
      navigate('/login');
      window.location.reload();
    }

    fetchGetDataWithAuth("/albums")
    .then(res => {
      setDataArray(res.data);
    })

  }, []);

  const classes = useStyles();
  
  return (
    <Grid container spacing={2}>
      {dataArray.map((data, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Link to={`/album/show?id=${data.id}`}>
            <Card className={classes.card} style={{ backgroundColor: getRandomColor() }}>
              <CardContent>
                <h1 style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{data.name}</h1>
              </CardContent>
            </Card>
            </Link>
          </Grid>
        )
      )}
    </Grid>
  )
};

export default AlbumDynamicGridPage;
