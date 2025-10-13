import { View } from 'react-native'

const Spacer = ({ width = "100%", height = 50 }) => {
  return (
    <View style={{ width, height }} />
  )
}

export default Spacer