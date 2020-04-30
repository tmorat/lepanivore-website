import { Context, Middleware } from '@nuxt/types';

const redirectToOrder: Middleware = (ctx: Context): void => {
  return ctx.redirect('/commander');
};

export default redirectToOrder;
