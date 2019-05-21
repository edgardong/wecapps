/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native'
// import AppRouter from './src/router/index'
import AppRouter from './src/router/tab'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => AppRouter)
