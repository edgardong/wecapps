/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native'
// import AppRouter from './src/navigation/index'
// import AppRouter from './src/navigation/tab'
import AppRouter from './src/navigation'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => AppRouter)
