
import { fetchDeleteDataWithAuth } from "client/client";
import { AppBar, Button, Toolbar, Typography } from "../../../../node_modules/@mui/material/index";
import { Link, useLocation } from "../../../../node_modules/react-router-dom/dist/index"

const Header = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const handleDelete = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete the Album?');
        if(isConfirmed){
            console.log('Item deleted : ', id);
            fetchDeleteDataWithAuth('/albums/' + id + '/delete')
            .then(res => {
                console.log(res);
                window.location.href = '/';
            })
        }else{
            console.log('Delete operation canceled.');
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow : 1 }}>
                    Photo Gallery
                </Typography>

                <Button
                    component={Link}
                    to={`/album/edit?id=${id}`}
                    color="inherit"
                    variant="contained"
                    sx={{ mr: 2, backgroundColor : '#799edc', '&:hover' : { backgroundColor : '#2f6ad0' } }}>
                    Edit Album
                </Button>

                <Button
                    component={Link}
                    to={`/album/upload?id=${id}`}
                    color='inherit'
                    variant='contained'
                    sx={{ mr:2, backgroundColor: '#4CAF50', '&:hover' : { backgroundColor: '#388E3C' } }}>
                    Upload Photos
                </Button>

                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                    }}
                    color="inherit"
                    variant="contained"
                    sx= {{ backgroundColor: '#F44336', '&:hover' : { backgroundColor : '#D32F2F' } }}>
                    Delete Album
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default Header