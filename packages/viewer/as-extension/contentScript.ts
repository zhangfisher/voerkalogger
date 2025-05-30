import { VoerkaPhone } from '../src/app/index.ts';

async function bootstrap() {
  const voerkaPhone = new VoerkaPhone({
    loader: ()=> {
      return {
 app: {
        baseURL: 'https://192.168.116.172:24443/api',
        plugin: true,
        rootId: 'voerka-phone',
      },
      call: {
        connectOpts: {
          host: '192.168.116.172',
          port: '24443',
          path: '/peer',
        },
      },
      }
    }

  });
  await voerkaPhone.start();
  // 不知道为啥初始化配置有问题,所以目前先这么修复一下
  voerkaPhone.modules.app.state.baseURL = 'https://192.168.116.172:24443/api';
  voerkaPhone.modules.call.state.connectOpts = {
    ...voerkaPhone.modules.call.state.connectOpts,
    host: '192.168.116.172',
    port: '24443',
    path: '/peer',
  };
}
bootstrap();
