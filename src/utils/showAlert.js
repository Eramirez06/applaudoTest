import { Toast } from 'native-base';
import { resize, Regular } from './styles';

import { primaryColor, blackColor } from '../assets/colors';

const showMessage = (
  title = '',
  duration = 2000,
  backgroundColor = '#000',
  color = '#fff',
) => {
  Toast.show({
    text: title,
    textStyle: {
      textAlign: 'center',
      fontSize: resize(14),
      color,
      fontWeight: '500',
      fontFamily: Regular,
    },
    buttonText: '',
    style: { backgroundColor: backgroundColor },
    duration: duration,
  });
};

export const showMessageAction = (
  title = '',
  duration = 2000,
  onClose,
  backgroundColor = '#000',
  color = '#fff',
) => {
  Toast.show({
    text: title,
    textStyle: {
      textAlign: 'center',
      fontSize: resize(14),
      color,
      fontFamily: Regular,
    },
    style: { backgroundColor: backgroundColor },
    duration: duration,
    buttonText: 'Confirmar',
    buttonTextStyle: {
      color: blackColor,
      fontFamily: Regular,
      fontSize: resize(12),
    },
    // buttonStyle: { backgroundColor: primaryColor },
    onClose,
  });
};

export default showMessage;
