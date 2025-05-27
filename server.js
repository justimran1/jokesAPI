import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
const APIURL = "https://v2.jokeapi.dev/joke/";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const cont1 =
  "only jokes that contain the specified word(S)/letter(S) will be returned.";
const cont2 =
  "you will only get jokes that are within the provided range of IDs. eg 2-7, or ID range of 5 will mean you will only get the 5th joke";
const cont3 = "Get any joke from any category with no blacklist flag";
const cont4 = "select your prefrences";
const cont5 = " select amount of jokes eg:1-7";
////
app.get("/", (req, res) => {
  res.render("index", {
    content1: cont1,
    content2: cont2,
    content3: cont3,
    content4: cont4,
    content5: cont5,
  });
});
//
app.get("/jokesbystring", async (req, res) => {
  const joke = req.query.searchbystring;
  try {
    const response = await axios.get(
      `https://v2.jokeapi.dev/joke/Any?contains=${joke}&format=txt`
    );
    const data = response.data;
    res.render("index", {
      content1: data,
      content2: cont2,
      content3: cont3,
      content4: cont4,
      content5: cont5,
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send("Error fetching data from API");
  }
});
//
app.get("/jokesById", async (req, res) => {
  const jokeId = req.query.searchById;
  try {
    const response = await axios.get(
      `${APIURL}Any?idRange=${jokeId}&format=txt`
    );
    const data = response.data;
    res.render("index", {
      content1: cont1,
      content2: data,
      content3: cont3,
      content4: cont4,
      content5: cont5,
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).send("Error fetching data from API");
  }
});
//
app.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${APIURL}Any?format=txt`);
    const data = response.data;
    res.render("index", {
      content1: cont1,
      content2: cont2,
      content3: data,
      content4: cont4,
      content5: cont5,
    });
  } catch (error) {
    console.error("you have an error :", error);
    res.status(500).send("error fecthing data from API");
  }
});
//
app.get("/jokesByNumber", async (req, res) => {
  const jokeNum = req.query.jokes;
  try {
    const response = await axios.get(
      `${APIURL}Any?amount=${jokeNum}&blacklistFlags=nsfw,sexist&format=txt`
    );
    res.render("index", {
      content1: cont1,
      content2: cont2,
      content3: cont3,
      content4: cont4,
      content5: response.data,
    });
  } catch (error) {
    console.error("you have an error :", error);
    res.status(500).send("error fecthing data from API");
  }
});
//
app.get("/category", async (req, res) => {
  const category = req.query.category;
  // Fix: get type from req.query.type (update your form to use name="type")
  const type = req.query.type;
  const blacklist = req.query["blacklist[]"];
  const blacklistArray = Array.isArray(blacklist)
    ? blacklist
    : blacklist
    ? [blacklist]
    : [];

  // Build URL
  let url = `${APIURL}${category}`;
  const params = ["format=txt"];
  if (type) params.push(`type=${type}`);
  if (blacklistArray.length > 0)
    params.push(`blacklistFlags=${blacklistArray.join(",")}`);
  if (params.length > 0) url += "?" + params.join("&");

  try {
    const response = await axios.get(url);
    const data = response.data;
    res.render("index", {
      content1: content1,
      content2: cont2,
      content3: cont3,
      content4: data,
      content5: cont5,
    });
  } catch (error) {
    console.error("you have an error :", error);
    res.render("index", { content4: "error fetching data from API" });
  }
});
// server start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
