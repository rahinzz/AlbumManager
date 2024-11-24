import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const AlbumPage = Loadable(lazy(() => import('pages/albums/albums')));
const AboutPage = Loadable(lazy(() => import('pages/staticPages/about')));
const AlbumAddPage = Loadable(lazy(() => import('pages/albums/albumAdd')));
const AlbumShowPage = Loadable(lazy(() => import('pages/albums/albumShow')));
const AlbumUploadPage = Loadable(lazy(() => import('pages/albums/albumUpload')));
const AlbumEditPage = Loadable(lazy(() => import('pages/albums/albumEdit')));
const PhotoEditPage = Loadable(lazy(() => import('pages/albums/photoEdit')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <AlbumPage />
    },
    {
      path: '/album/add',
      element: <AlbumAddPage />
    },
    {
      path: '/about',
      element: <AboutPage />
    },
    {
      path: '/album/show',
      element: <AlbumShowPage />
    },
    {
      path: '/album/upload',
      element: <AlbumUploadPage />
    },
    {
      path: '/album/edit',
      element: <AlbumEditPage />
    },
    {
      path: '/photo/edit',
      element: <PhotoEditPage />
    }
  ]
};

export default MainRoutes;
