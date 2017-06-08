'use strict'

const html = require('choo/html')
const shell = require('electron').shell

const Header = require('../elements/header')
const Sprite = require('../elements/sprite')
const Table = require('../elements/table')
const Intro = require('../elements/intro')
const Empty = require('../elements/empty')
const Download = require('../elements/download')
const Login = require('../elements/login')
const Register = require('../elements/register')

module.exports = mainView

const header = Header()
const sprite = Sprite()
const download = Download()
const intro = Intro()
const login = Login()
const register = Register()

// render the main view
// (obj, obj, fn) -> html
function mainView (state, emit) {
  const showIntroScreen = state.intro.show
  const showDownloadScreen = state.download.show
  const dats = state.dats.values
  const isReady = state.dats.ready
  const headerProps = {
    isReady: isReady,
    session: state.user.session,
    oncreate: () => emit('dats:create'),
    onimport: (link) => emit('dats:download', link),
    onreport: () => shell.openExternal('https://github.com/datproject/dat-desktop/issues'),
    onlogin: () => emit('user:login')
  }

  document.title = 'Dat Desktop'

  if (showDownloadScreen) {
    return html`
      <div>
        ${sprite.render()}
        ${header.render(headerProps)}
        ${download.render(Object.assign({}, state.download, {
          oncancel: () => emit('download:hide'),
          ondownload: ({ key, location }) => {
            emit('dats:clone', { key, location })
            emit('download:hide')
          },
          onupdate: () => {
            emit('render')
          }
        }))}
      </div>
    `
  }

  if (showIntroScreen) {
    document.title = 'Dat Desktop | Welcome'
    return html`
      <div>
        ${sprite.render()}
        ${intro.render({
          onexit: () => {
            emit('intro:hide')
          },
          onOpenHomepage: () => {
            emit('intro:open-homepage')
          },
          onupdate: () => {
            emit('render')
          }
        })}
      </div>
    `
  }

  if (state.user.show === 'login') {
    return html`
      <div>
        ${sprite.render()}
        ${header.render(headerProps)}
        ${login.render({
          onlogin: data => {
            emit('user:login!', data)
          },
          onregister: () => {
            emit('user:register')
          },
          error: state.user.loginError
        })}
      </div>
    `
  }

  if (state.user.show === 'register') {
    return html`
      <div>
        ${sprite.render()}
        ${header.render(headerProps)}
        ${register.render({
          onregister: data => {
            emit('user:register!', data)
          },
          onlogin: () => {
            emit('user:login')
          },
          error: state.user.registerError
        })}
      </div>
    `
  }

  if (!dats.length) {
    return html`
      <div>
        ${sprite.render()}
        ${header.render(headerProps)}
        ${Empty()}
      </div>
    `
  }

  return html`
    <div>
      ${sprite.render()}
      ${header.render(headerProps)}
      ${Table(state, emit)}
    </div>
  `
}
