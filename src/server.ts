import app from "./app";
import { env } from "./config/env";

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
