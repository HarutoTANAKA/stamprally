export default ({ store, route, redirect }) => {
  if (!store.getters.isAuthenticated && route.name === 'console') {
    redirect({ path: '/console/login' })
    // ログインしていない状態でコンソールにアクセスするとログイン画面にリダイレクト
  }
  if (store.getters.isAuthenticated && (route.name === 'console-login')) {
    redirect({ path: '/console' })
    // ログインしている状態でコンソールのログイン画面にアクセスするとコンソール画面にリダイレクト
  }
  if (!store.getters.isAuthenticated && (route.name === 'stamprally-id-home')) {
    redirect({ path: '/stamprally' })
    // ログインしていない状態で特定のスタンプラリーページにアクセスするとホーム画面にリダイレクト
  }
}
