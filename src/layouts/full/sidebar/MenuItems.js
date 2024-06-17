import {
  IconAperture, IconCopy, IconFileInvoice,IconShoppingCartPlus,IconFileReport, IconBrandAirtable,IconUsers,IconMeat,IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus, IconLogout,
} from '@tabler/icons';

import { uniqueId } from 'lodash';
const localData = window.localStorage.getItem('loggedFocusEvent');

console.log(localData)

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
  localData!=null && {
    id: uniqueId(),
    title: 'Menú de Hoy',
    icon: IconMeat,
    href: '/menu',
  },
  localData!=null && {
    id: uniqueId(),
    title: 'Pedidos',
    icon: IconShoppingCartPlus,
    href: '/pedido',
  },
  localData!=null && {
    id: uniqueId(),
    title: 'Mesas',
    icon: IconBrandAirtable,
    href: '/mesa',
  },
  localData!=null && {
    id: uniqueId(),
    title: 'Gestion Usuario',
    icon: IconUsers,
    href: '/usuario',
  },
  localData!=null && {
    id: uniqueId(),
    title: 'Reportes',
    icon: IconFileReport,
    href: '/reporte',
  },
  localData!=null && {
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
  localData==null && {
    id: uniqueId(),
    title: 'Inicio de Sesión',
    icon: IconLogin,
    href: '/auth/login',
  },
  localData==null && {
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
