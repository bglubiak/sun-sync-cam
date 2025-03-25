import axios, { AxiosResponse } from 'axios';

interface LoginResponse {
  cmd: string;
  code: number;
  value: {
    Token: {
      leaseTime: number;
      name: string;
    };
  };
}

export async function setWhiteLed(sunrise: string, sunset: string): Promise<void> {
  const userName = '';
  const password = '';
  const baseUrl = ``; // http://<camera-ip>

  // First, get the token
  const loginResponse: AxiosResponse<LoginResponse[]> = await axios.post(
    `${baseUrl}/api.cgi?cmd=Login`,
    [
      {
        cmd: 'Login',
        param: {
          User: {
            Version: '0',
            userName,
            password,
          },
        },
      },
    ],
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const token = loginResponse.data[0].value.Token.name;
  if (!token) {
    throw new Error('Failed to get authentication token');
  }

  console.log('Successfully authenticated with camera');

  // Parse sunrise and sunset times
  const [sunriseHour, sunriseMin] = sunrise.split(':').map(Number);
  const [sunsetHour, sunsetMin] = sunset.split(':').map(Number);

  // Make a request to control the LED using the token
  const response: AxiosResponse = await axios.post(
    `${baseUrl}/api.cgi?cmd=SetWhiteLed&token=${token}`,
    [
      {
        cmd: 'SetWhiteLed',
        param: {
          WhiteLed: {
            LightingSchedule: {
              StartHour: sunsetHour,
              StartMin: sunsetMin,
              EndHour: sunriseHour,
              EndMin: sunriseMin,
            },
            state: 0,
            channel: 0,
            mode: 3,
            bright: 100,
          },
        },
      },
    ],
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data[0]?.code !== 0) {
    throw new Error('Failed to update LED control');
  }

  console.log('LED control successfully updated');
}
