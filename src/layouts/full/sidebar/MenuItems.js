import {
  IconAperture, IconCopy, IconFileInvoice,IconShoppingCartPlus,IconFileReport, IconBrandAirtable,IconUsers,IconMeat,IconLayoutDashboard, IconBrandCashapp, IconLogin, IconGift, IconMoodHappy, IconTypography, IconUserPlus, IconLogout, IconCalendarEvent, IconShoppingCart
} from '@tabler/icons';

import { uniqueId } from 'lodash';
const localData = window.localStorage.getItem('loggedFocusEvent');
const localDataParsed = localData ? JSON.parse(localData) : null;
console.log(localDataParsed)
const token = localDataParsed ? JSON.parse(localDataParsed.token) : null;
const isLoggedIn = token !== null;

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Inicio',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Utilidades',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Menú de Hoy',
    icon: IconMeat,
    href: '/menu',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Pedidos',
    icon: IconShoppingCartPlus,
    href: '/pedido',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Mesas',
    icon: IconBrandAirtable,
    href: '/mesa',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Gestion Usuario',
    icon: IconUsers,
    href: '/usuario',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Reportes',
    icon: IconFileReport,
    href: '/reporte',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Facturas',
    icon: IconFileInvoice,
    href: '/factura',
  },
  {
    id: uniqueId(),
    title: 'Typography',
    icon: IconTypography,
    href: '/ui/typography',
  },
  {
    id: uniqueId(),
    title: 'Shadow',
    icon: IconCopy,
    href: '/ui/shadow',
  },
  {
    navlabel: true,
    subheader: 'Autenticación',
  },
  !isLoggedIn && {
    id: uniqueId(),
    title: 'Inicio de Sesión',
    icon: IconLogin,
    href: '/auth/login',
  },
  !isLoggedIn && {
    id: uniqueId(),
    title: 'Registro',
    icon: IconUserPlus,
    href: '/auth/register',
  },
  {
    id: uniqueId(),
    title: 'Cerrar Sesión',
    icon: IconLogout,
    href: '/',
  },
  {
    navlabel: true,
    subheader: 'Extra',
  },
  {
    id: uniqueId(),
    title: 'Icons',
    icon: IconMoodHappy,
    href: '/icons',
  },
  {
    id: uniqueId(),
    title: 'Sample Page',
    icon: IconAperture,
    href: '/sample-page',
  },
].filter(Boolean);
export default Menuitems;
