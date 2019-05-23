export default function({ store, redirect, route }) {
  const user = store.state.user.currentUser
  if (isEmpty(user) && route.name != 'login') {
    redirect('/login')
  }
}

function isEmpty(obj) {
  return Object.getOwnPropertyNames(obj).length === 0
}
