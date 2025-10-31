import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

console.log("Loading environment variables...");

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is required");
}

const QDRANT_URL = process.env.QDRANT_URL;

if (!QDRANT_URL) {
  throw new Error("QDRANT_URL environment variable is required");
}
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.delete("/resource/:collection", async (req, res) => {
  const { collection } = req.params;
  console.log(`DELETE /resource/${collection} called`);
  try {
    // Get all point IDs in the collection
    //
    const scrollResp = await axios
      .post(
        `${QDRANT_URL}/collections/${collection}/points/scroll`,
        {
          limit: 10000, // adjust as needed for your collection size
        },
        {
          headers: {
            "api-key": process.env.QDRANT_API_KEY,
          },
        },
      )
      .catch((err) => {
        console.error(
          "Error fetching points from collection:",
          err.response?.data || err.message,
        );
        throw new Error(
          `Error fetching points from collection: ${err.response?.data || err.message}`,
        );
      });

    const points = await scrollResp?.data?.result?.points;
    console.log(
      `Fetched ${points.length} points from collection ${collection}`,
    );

    if (points.length === 0) {
      console.log(`No resources found in collection ${collection}`);
      return res.json({
        success: true,
        deleted: 0,
        message: "No resources found to delete",
      });
    }
    const ids = points.map((p) => p.id);

    // Delete all points
    const deleteResp = await axios.post(
      `${QDRANT_URL}/collections/${collection}/points/delete`,
      {
        points: ids,
      },
      {
        headers: {
          "api-key": process.env.QDRANT_API_KEY,
        },
      },
    );
    console.log(`Deleted ${ids.length} points from collection ${collection}`);
    res.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error("Error in DELETE /resource/:collection:", err.message);
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  console.log("GET / called");
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
