import { getSunTimes } from "./getSunTimes";
import { setWhiteLed } from "./ledControl";

// Define a top-level async function
async function main() {
	const { sunriseUTC: sunrise, sunsetUTC: sunset } = await getSunTimes();

	const cameras = [
		{
			userName: "<username>",
			password: "<password>",
			baseUrl: "http://<camera-ip>",
		},
		{
			userName: "<username>",
			password: "<password>",
			baseUrl: "http://<camera-ip>",
		}, // Add more cameras as needed
	];

	await setWhiteLed(sunrise, sunset, cameras);
}

// Execute the function
main().catch((error) => {
	console.error("Error:", error);
});
