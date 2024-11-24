import { useState } from "react";
import { makeStyles } from "../../../node_modules/@mui/styles/index";
import Header from "./albums/header";
import { Box, Button, CircularProgress, Container, Grid, IconButton, Paper, Typography } from "../../../node_modules/@mui/material/index";
import { AddCircleOutline, Close } from "../../../node_modules/@mui/icons-material/index";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchPostFileUploadWithAuth } from "client/client";

const useStyles = makeStyles((theme) => ({
    dropzonecontainer: {
        border : `2px dashed ${theme.palette.primary.main}`,
        borderRadius : theme.spacing(2),
        padding : theme.spacing(4),
        textAlign : 'center',
        cursor : 'pointer',
    },
    uploadedFile : {
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding : theme.spacing(2),
        marginTop : theme.spacing(2),
        border : `1px solid ${theme.palette.secondary.main}`,
        borderRadius : theme.spacing(1),
    }
}));

const FileUploadPage = () => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const navigate = useNavigate();
    
    const onDrop = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i != index));
    }

    const handleUpload = async () => {
        try {
            setProcessing(true);
            const formData = new FormData();

            // Append files with the part name 'files'
            files.forEach((file) => {
                formData.append('files', file);
            })

            fetchPostFileUploadWithAuth(`/albums/${id}/upload-photos`, formData)
            .then((res) => {
                console.log('Uploaded successfully: ', res.data)
                navigate(`/album/show?id=${id}`);
            });

            // Reset the files state after successful upload
            setFiles([]);
        }catch(error){
            console.log('Errror uploading files : ', error.message);
        }
    };

    return (
        <div>
            <Header />
            <Container>
                <Paper elevation={3} style={{ padding : '20px', marginTop : '20px' }}> 
                    <Grid container spacing={2}>
                        <Typography variant='h4' textAlign='center' gutterBottom>
                            Photo Upload
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Paper elevation={3} className={classes.dropzonecontainer}>
                            <AddCircleOutline fontSize="large" color="primary" />
                            <Typography variant='h6'>
                                Drag and drop photos or click to select files
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            {files.map((file, index) => (
                                <Paper 
                                    key={index}
                                    elevation={3}
                                    className={classes.uploadedFile}>
                                        <Typography>{file.name}</Typography>
                                        <IconButton
                                            onClick={() => removeFile(index)}
                                            color="secondary">
                                            <Close />
                                        </IconButton>
                                </Paper>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {processing ? (
                            <Box textAlign="center">
                                <CircularProgress />
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    marginTop="10px">
                                        Uploading...
                                </Typography>
                            </Box>
                        ) : (
                            <Button 
                                variant="contained"
                                color="primary"
                                onClick={handleUpload}
                                disabled={files.length === 0}>
                                Upload Photo
                            </Button>
                        )}
                    </Grid>
                </Paper>
            </Container>
        </div>
    )
};

export default FileUploadPage;