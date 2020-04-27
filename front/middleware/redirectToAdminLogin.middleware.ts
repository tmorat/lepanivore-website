import { Context, Middleware } from '@nuxt/types';

const redirectToAdminLogin: Middleware = (ctx: Context): void => {
  return ctx.redirect('/admin/connexion');
};

export default redirectToAdminLogin;
