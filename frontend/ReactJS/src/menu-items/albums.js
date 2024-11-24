// assets
import { PictureOutlined, FileImageOutlined } from '@ant-design/icons';

// icons
const icons = {
  PictureOutlined,
  FileImageOutlined
};


const albums = {
  id: 'albums',
  title: 'Albums',
  type: 'group',
  children: [
    {
      id: 'Album',
      title: 'Albums',
      type: 'item',
      url: '/',
      icon: icons.PictureOutlined
    },
    {
      id : 'AddAlbum',
      title : 'Add Album',
      type : 'item',
      url : '/album/add',
      icon : FileImageOutlined
    }
  ]
};

export default albums;
