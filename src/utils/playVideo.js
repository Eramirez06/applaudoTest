import { Platform } from 'react-native';

//Libs
import {
  YouTubeStandaloneIOS,
  YouTubeStandaloneAndroid,
} from 'react-native-youtube';

//Custom
import { YT_KEY } from '../../enviroment';

export const playVideo = (videoId) => {
  Platform.OS === 'android'
    ? YouTubeStandaloneAndroid.playVideo({
        apiKey: YT_KEY, // Your YouTube Developer API Key
        videoId, // YouTube video ID
      })
    : YouTubeStandaloneIOS.playVideo(videoId)
        .then((message) => console.log(message))
        .catch((errorMessage) => console.error(errorMessage));
};
