import axios from 'axios';
import moment from 'moment-timezone';

// --- Configuration (should be loaded from environment variables) ---
const LATITUDE = process.env.LATITUDE || '51.1079';
const LONGITUDE = process.env.LONGITUDE || '17.0385';
const TIMEZONE = process.env.TIMEZONE || 'Europe/Warsaw';

// --- Constants ---
const API_URL = `https://api.sunrise-sunset.org/json?lat=${LATITUDE}&lng=${LONGITUDE}&formatted=0`;

// --- Type Definitions ---
interface SunTimes {
  sunrise: string;
  sunset: string;
}

interface SunriseSunsetResponse {
  results: {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    day_length: number;
    civil_twilight_begin: string;
    civil_twilight_end: string;
    nautical_twilight_begin: string;
    nautical_twilight_end: string;
    astronomical_twilight_begin: string;
    astronomical_twilight_end: string;
  };
  status: string;
}

/**
 * Fetches sunrise and sunset times for a configured location and timezone.
 */
export async function getSunTimes(): Promise<SunTimes> {
  try {
    console.log(`Fetching sun times for timezone: ${TIMEZONE}`);
    const response = await axios.get<SunriseSunsetResponse>(API_URL);

    if (response.data.status !== 'OK') {
      throw new Error(`Sunrise/Sunset API returned status: ${response.data.status}`);
    }

    const sunrise = moment(response.data.results.sunrise).tz(TIMEZONE).format('HH:mm');
    const sunset = moment(response.data.results.sunset).tz(TIMEZONE).format('HH:mm');

    console.log(`Sunrise in ${TIMEZONE}: ${sunrise}`);
    console.log(`Sunset in ${TIMEZONE}: ${sunset}`);

    return { sunrise, sunset };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching sunrise and sunset times:', error.message);
    }
    throw new Error(
      'Failed to get sunrise and sunset times. Please check your configuration and network connection.'
    );
  }
}
