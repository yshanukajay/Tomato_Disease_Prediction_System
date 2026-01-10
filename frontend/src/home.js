import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';
import axios from 'axios';




const ColorButton = withStyles((theme) => ({
  root: {
    color: "#ffffff",
    background: "linear-gradient(45deg, #f44336 30%, #e91e63 90%)",
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    padding: "12px 32px",
    boxShadow: "0 3px 5px 2px rgba(244, 67, 54, .3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    '&:hover': {
      background: "linear-gradient(45deg, #d32f2f 30%, #c2185b 90%)",
      boxShadow: "0 6px 10px 2px rgba(244, 67, 54, .4)",
      transform: "translateY(-2px)",
    },
    '&:active': {
      transform: "translateY(0px)",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "100%",
    borderRadius: "8px",
    padding: "12px 24px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "none",
    background: "linear-gradient(45deg, #f44336 30%, #e91e63 90%)",
    boxShadow: "0 3px 5px 2px rgba(244, 67, 54, .3)",
    transition: "all 0.3s ease",
    '&:hover': {
      background: "linear-gradient(45deg, #d32f2f 30%, #c2185b 90%)",
      boxShadow: "0 4px 8px 2px rgba(244, 67, 54, .4)",
      transform: "translateY(-1px)",
    },
  },
  root: {
    maxWidth: 500,
    flexGrow: 1,
  },
  media: {
    height: 400,
    borderRadius: "12px 12px 0 0",
  },
  paper: {
    padding: theme.spacing(3),
    margin: 'auto',
    maxWidth: 600,
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },
  gridContainer: {
    justifyContent: "center",
    padding: "2em 1em",
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    alignItems: "center",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    minHeight: "100vh",
    paddingTop: "0px",
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 0,
    },
    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
  },
  imageCard: {
    margin: "auto",
    maxWidth: 500,
    minHeight: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
    borderRadius: '24px',
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '&:hover': {
      transform: "translateY(-8px) scale(1.02)",
      boxShadow: '0 32px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
    },
  },
  imageCardEmpty: {
    minHeight: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    margin: "16px 0",
  },
  table: {
    backgroundColor: 'transparent',
    minWidth: 200,
  },
  tableHead: {
    backgroundColor: '#f8f9fa',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f8f9fa',
    },
    '&:hover': {
      backgroundColor: '#e3f2fd',
    },
  },
  tableCell: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2c3e50',
    padding: '16px',
    borderBottom: '1px solid #e0e0e0',
  },
  tableCell1: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#546e7a',
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #e0e0e0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableBody: {
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
    fontWeight: 500,
  },
  buttonGrid: {
    maxWidth: "500px",
    width: "100%",
    marginTop: "24px",
  },
  detail: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: "32px",
    borderRadius: "0 0 24px 24px",
    borderTop: "1px solid rgba(0,0,0,0.05)",
  },
  appbar: {
    background: "rgba(30, 60, 114, 0.95)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    color: 'white',
    height: "80px",
    justifyContent: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  toolbar: {
    height: "80px",
    padding: "0 32px",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  logo: {
    width: 50,
    height: 50,
    border: "3px solid rgba(255,255,255,0.3)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  loader: {
    color: '#2196f3',
    marginBottom: "16px",
  },
  loadingText: {
    color: '#546e7a',
    fontWeight: 500,
    fontSize: '18px',
  },
  dropzoneContainer: {
    padding: "48px 32px",
    minHeight: "320px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.9) 100%)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    margin: "16px",
  },
  confidenceHigh: {
    color: '#4caf50',
    fontWeight: 700,
  },
  confidenceMedium: {
    color: '#ff9800',
    fontWeight: 700,
  },
  confidenceLow: {
    color: '#f44336',
    fontWeight: 700,
  },
  resultCard: {
    background: "linear-gradient(135deg, rgba(232,245,232,0.95) 0%, rgba(241,248,233,0.95) 100%)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "24px",
    margin: "20px 0",
    border: "1px solid rgba(200,230,201,0.5)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
  diseaseLabel: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#2e7d32",
    marginBottom: "8px",
    textAlign: "center",
  },
}));
export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      try {
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL || "http://localhost:8000/predict",
          data: formData,
        });
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error predicting disease:", error);
        // You could add error state handling here
      }
      setIsloading(false);
    }
  }

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  const getConfidenceClass = () => {
    const conf = parseFloat(confidence);
    if (conf >= 80) return classes.confidenceHigh;
    if (conf >= 60) return classes.confidenceMedium;
    return classes.confidenceLow;
  };

  const formatDiseaseLabel = (label) => {
    return label.replace(/Tomato_/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.title} variant="h5" noWrap>
              🍅 Tomato Disease Classification System
          </Typography>
          <div className={classes.grow} />
          <Avatar src="/cblogo.PNG.png" className={classes.logo}></Avatar>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={12} md={8} lg={6}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="image"
                  title="Uploaded Tomato Leaf"
                />
              </CardActionArea>
              }
              {!image && <CardContent className={classes.dropzoneContainer}>
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  dropzoneText={"📸 Drag and drop an image of a tomato plant leaf or click to upload"}
                  onChange={onSelectFile}
                  maxFileSize={5000000}
                  showFileNames={true}
                  showAlerts={true}
                  filesLimit={1}
                />
              </CardContent>}
              {data && <CardContent className={classes.detail}>
                <div className={classes.resultCard}>
                  <Typography className={classes.diseaseLabel}>
                    Disease Detected: {formatDiseaseLabel(data.class)}
                  </Typography>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="prediction results">
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableRow}>
                          <TableCell className={classes.tableCell1}>Disease Type</TableCell>
                          <TableCell align="right" className={classes.tableCell1}>Confidence Level</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tableBody}>
                        <TableRow className={classes.tableRow}>
                          <TableCell component="th" scope="row" className={classes.tableCell}>
                            {formatDiseaseLabel(data.class)}
                          </TableCell>
                          <TableCell align="right" className={`${classes.tableCell} ${getConfidenceClass()}`}>
                            {confidence}%
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </CardContent>}
              {isLoading && <CardContent className={classes.detail}>
                <CircularProgress size={60} className={classes.loader} />
                <Typography className={classes.loadingText} variant="h6" noWrap>
                  🔬 Analyzing leaf image...
                </Typography>
                <Typography variant="body2" style={{color: '#9e9e9e', marginTop: '8px'}}>
                  Please wait while our AI processes your image
                </Typography>
              </CardContent>}
            </Card>
          </Grid>
          {data &&
            <Grid item xs={12} md={8} lg={6} className={classes.buttonGrid}>
              <ColorButton 
                variant="contained" 
                className={classes.clearButton} 
                color="primary" 
                component="span" 
                size="large" 
                onClick={clearData} 
                startIcon={<Clear fontSize="large" />}
                fullWidth
              >
                🔄 Analyze Another Image
              </ColorButton>
            </Grid>}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
