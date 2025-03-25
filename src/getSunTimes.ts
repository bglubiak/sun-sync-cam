import axios from 'axios';
import moment from 'moment-timezone';

interface SunTimes {
  sunriseUTC: string;
  sunsetUTC: string;
}

export async function getSunTimes(): Promise<SunTimes> {
  const lat = 51.1079; // geographical latitude
  const lng = 17.0385; // geographical longitude
  const timezone = 'Europe/Warsaw'; // timezone

  try {
    const response = await axios.get(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
    );
    const sunriseUTC = moment(response.data.results.sunrise).tz(timezone).format('HH:mm');
    const sunsetUTC = moment(response.data.results.sunset).tz(timezone).format('HH:mm');

    console.log(`Dawn at ${timezone}: ${sunriseUTC}`);
    console.log(`Dusk at ${timezone}: ${sunsetUTC}`);

    return { sunriseUTC, sunsetUTC };
  } catch (error) {
    console.error('Error while getting data:', error);
    throw new Error('Failed to get sunrise and sunset times');
  }
}
