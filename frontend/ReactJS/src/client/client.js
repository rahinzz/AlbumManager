import axios from "../../node_modules/axios/index"

const API_version = "/api/v1";

const fetchGetData = (uri) => {
    const url = `${API_version}${uri}`;
    return axios.get(url)
    .catch(error => {
        console.error("Error fetching data from URL : ", url, "Error ", error.message);

        throw error;
    })
}

const fetchPostData = (uri, payload) => {
    const url = `${API_version}${uri}`;
    return axios.post(url, payload)
    .catch(error => {
        Console.error('Error fetching data for Url: ', url, 'Error : ', error.message);
        throw error;
    })
};

const fetchPostDataWithAuth = (uri, payload) => {
    console.log(payload);
    const token = localStorage.getItem('token');
    const url = `${API_version}${uri}`;
    return axios.post(url, payload, {headers: {
        "accept" : "*/*",
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${token}` 
    },
    })
    .catch(error => {
        //handle exception errors
        console.error('Error fetching data for URL: ', url, 'Error: ', error.message);

        throw error;
    })
}

const fetchGetDataWithAuth = async (uri) => {
    const token = localStorage.getItem('token');
    const url = `${API_version}${uri}`;
    try {

        const response = await axios.get(url, {headers : { "Authorization" : `Bearer ${token}`, }});
        console.log("Returning axios response", response)
        
        return response;
    } catch (error) {
        //handle errors if the request fails
        console.error("Error fetching data : ", error);
    }
}

const fetchPostFileUploadWithAuth = async (uri, formData) => {
    const token = localStorage.getItem('token');
    const url = `${API_version}${uri}`;
    try {

        const response = await axios.post(url, formData, {
            headers : {
                'Content-Type' : 'multipart/form-data',
                'Authorization' : `Bearer ${token}`,
            },
        })
        
        return response;
    } catch (error) {
        //handle errors if the request fails
        console.error("Error uploading file : ", error);
    }
}

const fetchGetDataWithAuthArrayBuffer = async (uri) => {
    const token = localStorage.getItem('token');
    const url = `${API_version}${uri}`;
    try {

        const response = await axios.get(url, {headers : { "Authorization" : `Bearer ${token}`, }, responseType : 'arraybuffer'});
        
        return response;
    } catch (error) {
        //handle errors if the request fails
        console.error("Error fetching data : ", error);
    }
}

const fetchPutDataWithAuth = async (uri, payload) => {
    console.log(payload);
    const token = localStorage.getItem('token');
    const url = `${API_version}${uri}`;
    return axios.put(url, payload, {headers: {
        "accept" : "*/*",
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${token}` 
    },
    })
    .catch(error => {
        //handle exception errors
        console.error('Error fetching data for URL: ', url, 'Error: ', error.message);

        throw error;
    })
}

const fetchDeleteDataWithAuth = async (uri) => {
    const token = localStorage.getItem('token');
    const url = `${API_version}${uri}`;
    return axios.delete(url, {headers: {
        "accept" : "*/*",
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${token}` 
    },
    })
    .catch(error => {
        //handle exception errors
        console.error('Error fetching data for URL: ', url, 'Error: ', error.message);

        throw error;
    })
}

const fetchGetBlobDataWithAuth = async (uri) => {
    const token = localStorage.getItem('token');
    const url = `${API_version}${uri}`;
    return axios.get(url, {headers: {
        "accept" : "*/*",
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${token}` 
        },
        responseType : 'blob',
    })
    .catch(error => {
        //handle exception errors
        console.error('Error fetching data for URL: ', url, 'Error: ', error.message);

        throw error;
    })
}

export default fetchGetData;
export { fetchPostData, fetchPostDataWithAuth, fetchGetDataWithAuth, fetchPostFileUploadWithAuth, fetchGetDataWithAuthArrayBuffer, fetchPutDataWithAuth, fetchDeleteDataWithAuth, fetchGetBlobDataWithAuth };