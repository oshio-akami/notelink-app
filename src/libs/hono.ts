import { hc } from "hono/client";
import type { AppType } from "@/app/api/[...route]/route";

const client=hc<AppType>("/");

export default client;