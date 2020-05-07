import { Context } from '@nuxt/types';
import redirectToOrder from '~/middleware/redirectToOrder.middleware';

describe('middleware/redirectToOrderMiddleware', () => {
  let ctx: Context;

  beforeEach(() => {
    ctx = ({
      redirect: jest.fn(),
    } as unknown) as Context;
  });

  it('should redirect to commander page', () => {
    // when
    // @ts-ignore
    redirectToOrder(ctx);

    // then
    expect(ctx.redirect).toHaveBeenCalledWith('/commander');
  });
});
