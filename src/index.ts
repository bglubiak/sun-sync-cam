import { getSunTimes } from './getSunTimes';
import { setWhiteLed } from './ledControl';

// Define a top-level async function
async function main() {
  const { sunriseUTC: sunrise, sunsetUTC: sunset } = await getSunTimes();

  await setWhiteLed(sunrise, sunset);
}

// Execute the function
main().catch(error => {
  console.error('Error:', error);
});
