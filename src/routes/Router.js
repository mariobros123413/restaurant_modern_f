import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Factura from 'src/views/bill/Factura';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Home = Loadable(lazy(() => import('../views/dashboard/Home')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')))
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const Evento = Loadable(lazy(() => import('../views/events/Evento')));
const Asistencia = Loadable(lazy(() => import('../views/assist/Asistencia')));
const SubirFotos = Loadable(lazy(() => import('../views/photos/SubirFotos')));
const Menu = Loadable(lazy(() => import('../views/cart/Menu')));
const Usuarios = Loadable(lazy(() => import('../views/cart/Usuarios')));
const Reportes = Loadable(lazy(() => import('../views/order/Reporte')));
const Suscripcion = Loadable(lazy(() => import('../views/suscription/Suscripcion')));
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '/menu', exact: true, element: <Menu /> },
      { path: '/pedido', exact: true, element: <Asistencia /> },////////
      { path: '/asistencia/:nombre/:idgaleria', exact: true, element: <SubirFotos /> },
      { path: '/mesa', exact: true, element: <Evento /> },
      { path: '/usuario', exact: true, element: <Usuarios /> },
      { path: '/factura', exact: true, element: <Factura /> },
      { path: '/reporte', exact: true, element: <Reportes /> },
      { path: '/suscripcion', element: <Suscripcion /> },
      { path: '*', element: <Navigate to="/suscripcion" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Navigate to="/suscripcion" /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/suscripcion" /> },
    ],
  },
  {
    path: '/home',
    element: <BlankLayout />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '*', element: <Navigate to="/suscripcion" /> },
    ],
  }
];

export default Router;
