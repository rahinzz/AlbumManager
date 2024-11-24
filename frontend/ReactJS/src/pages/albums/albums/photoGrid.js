import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardMedia, Grid, Modal, Tooltip, Typography } from "../../../../node_modules/@mui/material/index";
import { useLocation } from "../../../../node_modules/react-router-dom/dist/index";
import { fetchDeleteDataWithAuth, fetchGetBlobDataWithAuth, fetchGetDataWithAuth, fetchGetDataWithAuthArrayBuffer } from "client/client";
import { Buffer } from "buffer";
import { makeStyles } from "../../../../node_modules/@mui/styles/index";

const useStyles = makeStyles((theme) => ({
    modal : {
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center',
    },
    modalMain : {
        backgroundColor : theme.palette.background.paper,
        borderRadius : '10px',
        boxShadow : theme.shadows[5],
        padding : theme.spacing(2, 4, 3),
        maxHeight : '90vw',
        maxWidth : '60vh',
        overflow : 'auto'
    },
    closeButton : {
        marginLeft : 'auto'
    }})
)

const PhotoGrid = () => {

    const [photos, setPhotos] = useState({});
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const album_id = queryParams.get('id');
    const [albumInfo, setAlbumInfo] = useState({});
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [PhotoContent, setPhotoContent] = useState(null);
    const [PhotoDesc, setPhotoDesc] = useState(null);
    const [DownloadLink, setDownloadLink] = useState(null);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleView = (download_link, description) => {
        
        fetchGetDataWithAuthArrayBuffer(download_link)
                .then(response => {
                    const buffer = Buffer.from(response.data, 'binary').toString('base64');
                    setPhotoContent(buffer);
                })

        setDownloadLink(download_link);
        setPhotoDesc(description);
        handleOpen();
    };
    const handleDownload = (download_link) => {
        fetchGetBlobDataWithAuth(download_link)
        .then(response => {
            const disposition = response.headers.get('Content-Disposition');
            const match = /filename="(.*)"/.exec(disposition);
            const filename = match ? match[1] : 'downloadedFile';
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        })
        .catch(error => {
            console.log('Error downloading photo : ', error);
        })
    };
    const handleDelete = (photo_id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete the Photo?');
        if(isConfirmed){
            console.log('Item deleted : ', photo_id);
            fetchDeleteDataWithAuth('/albums/' + album_id + '/photos/' + photo_id + '/delete')
            .then(res => {
                console.log(res);
                window.location.reload();
            })
        }else{
            console.log('Delete operation canceled.');
        }
    };

    useEffect(() => {
        fetchGetDataWithAuth(`/albums/${album_id}`)
        .then(res => {
            setAlbumInfo(res.data);
            const photoList = res.data.photos;

            photoList.forEach(photo => {

                let thumnbnail_link = photo.download_link.replace('/download-photo', '/download-thumbnail');
                fetchGetDataWithAuthArrayBuffer(thumnbnail_link)
                .then(response => {
                    const albumPhotoID = 'album_' + album_id + '_photo+' + photo.id;

                    const buffer = Buffer.from(response.data, 'binary').toString('base64');

                    const temp = {
                        'album_id' : album_id,
                        'photo_id' : photo.id,
                        'name' : photo.name,
                        'description' : photo.description,
                        'content' : buffer,
                        'download_link' : photo.download_link
                    }

                    setPhotos(prevPhotos => ({ ...prevPhotos, [albumPhotoID] : temp }));
                })
            });
        })
    }, [album_id]);

    return (
        <div>
            <Modal 
                open = {open}
                onClose = {handleClose}
                aria-labelledby = "modal-modal-title"
                aria-describedby = "modal-modal-description"
                className = {classes.modal}>
                
                <div className={classes.modalMain}>
                    <img src={'data:image/jpeg;base64,' + PhotoContent} alt={PhotoDesc} style={{ width : '100%', height : 'auto' }} />
                    <Button onClick={() => handleDownload(DownloadLink)}>Download Photo</Button>
                    <Button onClick={handleClose} className={classes.closeButton}>Close</Button>
                </div>

            </Modal>
            <Typography variant="h4" gutterBottom>{albumInfo.name}</Typography>
            <Typography variant="subtitle1" gutterBottom>{albumInfo.description}</Typography>
            <Grid container spacing={2}>
            {Object.keys(photos).map((key) => (
                <Grid item key = {key} xs={8} sm={4} md={4} lg={2}>
                    <Card>
                        <Tooltip title = {photos[key]['description']}>
                            <CardMedia component = "img" height="200" image={'data:image/jpeg;base64,' + photos[key]['content']} alt={photos[key]['description']} />

                        </Tooltip>
                        <CardContent>
                            <Tooltip title={photos[key]['description']}>
                                <Typography variant="subtitle1">{photos[key]['name']}</Typography>
                            </Tooltip>
                            <a href="#" onClick={() => {
                                handleView(photos[key]['download_link'], photos[key]['description']);
                            }}> View |</a>
                            <a href={`/photo/edit?album_id=${album_id}&photo_id=${photos[key]['photo_id']}&photo_name=${photos[key]['name']}&photo_desc=${photos[key]['description']}`} > Edit |</a>
                            <a href="#" onClick={() => {
                                handleDownload(photos[key]['download_link'])
                            }}> Download |</a>
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                handleDelete(photos[key]['photo_id'])
                            }}> Delete </a>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
        </div>
    )
}

export default PhotoGrid;