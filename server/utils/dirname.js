import { fileURLToPath } from "url";
import { dirname } from "path";

/* Utility function to add __dirname to ES6 modules */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
