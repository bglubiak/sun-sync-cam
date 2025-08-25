import { getSunTimes } from './getSunTimes';
import { setWhiteLed } from './ledControl';

/**
 * Main function to fetch sun times and set the camera's LED schedule.
 */
async function main() {
  console.log('Starting sun-sync-cam process...');
  const { sunriseUTC: sunrise, sunsetUTC: sunset } = await getSunTimes();
  console.log(`Fetched sun times. Sunrise: ${sunrise}, Sunset: ${sunset}`);

  await setWhiteLed(sunrise, sunset);
  console.log('Process completed successfully.');
}

main().catch(error => {
  console.error('Failed to complete the process.');
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('An unknown error occurred:', error);
  }
  process.exit(1); // Exit with a failure code
});
