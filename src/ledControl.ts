import axios from 'axios';

const USER_NAME = process.env.CAMERA_USER;
const PASSWORD = process.env.CAMERA_PASSWORD;
const BASE_URL = process.env.CAMERA_BASE_URL;

// Validate required environment variables
if (!USER_NAME) {
  console.error('Missing required environment variable: CAMERA_USER');
  process.exit(1);
}
if (!PASSWORD) {
  console.error('Missing required environment variable: CAMERA_PASSWORD');
  process.exit(1);
}
if (!BASE_URL) {
  console.error('Missing required environment variable: CAMERA_BASE_URL');
  process.exit(1);
}

// --- Constants ---
const CMD_LOGIN = 'Login';
const CMD_SET_WHITE_LED = 'SetWhiteLed';

// --- Type Definitions ---
interface ApiResponse<T> {
  cmd: string;
  code: number;
  value: T;
}

interface LoginToken {
  Token: {
    leaseTime: number;
    name: string;
  };
}

interface WhiteLedParams {
  WhiteLed: {
    LightingSchedule: {
      StartHour: number;
      StartMin: number;
      EndHour: number;
      EndMin: number;
    };
    state: number;
    channel: number;
    mode: number;
    bright: number;
  };
}

// --- Helper Functions ---

/**
 * Authenticates with the camera and returns an API token.
 */
async function login(): Promise<string> {
  const payload = [
    {
      cmd: CMD_LOGIN,
      param: { User: { Version: '0', userName: USER_NAME, password: PASSWORD } },
    },
  ];

  const response = await axios.post<ApiResponse<LoginToken>[]>(
    `${BASE_URL}/api.cgi?cmd=${CMD_LOGIN}`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  const token = response.data[0]?.value?.Token?.name;
  if (response.data[0]?.code !== 0 || !token) {
    throw new Error('Failed to authenticate with camera. Check credentials and network.');
  }

  console.log('Successfully authenticated with camera');
  return token;
}

/**
 * Sets the white LED lighting schedule on the camera.
 * @param sunrise - The sunrise time in "HH:mm" format.
 * @param sunset - The sunset time in "HH:mm" format.
 */
export async function setWhiteLed(sunrise: string, sunset: string): Promise<void> {
  try {
    const token = await login();

    const [sunriseHour, sunriseMin] = sunrise.split(':').map(Number);
    const [sunsetHour, sunsetMin] = sunset.split(':').map(Number);

    const payload: { cmd: string; param: WhiteLedParams }[] = [
      {
        cmd: CMD_SET_WHITE_LED,
        param: {
          WhiteLed: {
            LightingSchedule: {
              StartHour: sunsetHour,
              StartMin: sunsetMin,
              EndHour: sunriseHour,
              EndMin: sunriseMin,
            },
            state: 0, // 0 for schedule mode
            channel: 0,
            mode: 3, // 3 for "Smart" mode
            bright: 100,
          },
        },
      },
    ];

    const response = await axios.post<ApiResponse<unknown>[]>(
      `${BASE_URL}/api.cgi?cmd=${CMD_SET_WHITE_LED}&token=${token}`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data[0]?.code !== 0) {
      throw new Error(
        `Failed to update LED control. API responded with code: ${response.data[0]?.code}`
      );
    }

    console.log('LED control successfully updated');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('An error occurred while setting the LED schedule:', error.message);
    }
    throw error; // Re-throw the error for upstream handlers
  }
}
