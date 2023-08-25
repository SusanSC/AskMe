import React, { useState } from "react";
import Header from "../Header/Header";
import AppStyle from "./AppStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import OpenAI from "openai";
import Spinner from "react-bootstrap/Spinner";

const params = {
  temperature: 0.5,
  max_tokens: 256,
};

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: process.env.REACT_APP_OPENAI_KEY,
});

function App() {
  const [questionType, setQuestionType] = useState("General");
  const [cbResponse, setCbResponse] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 1, name: "General" },
    { id: 2, name: "Translate" },
    { id: 3, name: "Weather" },
    { id: 4, name: "Recipe" },
  ];

  const getInstructions = (qt, input) => {
    let prompt;
    switch (qt) {
      case "General":
        prompt = input;
        break;
      case "Translate":
        prompt = `If this text is in Spanish, translate it to English, else translate it to Spanish: ${input}`;
        break;
      case "Weather":
        prompt = `If this question is related to weather, answer it: ${input}, else say: Can't answer this.`;
        break;
      case "Recipe":
        prompt = `If this text is related to ANY food or drink, answer with the recipe of that: ${input}, else say: Can't find a recipe for this.`;
        break;
      default:
        prompt = input;
    }
    return prompt;
  };

  const handleSendData = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const prompt = getInstructions(questionType, userInput);
    const endpoint =
      "https://api.openai.com/v1/engines/text-davinci-003/completions";
    const body = { ...params, prompt };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openai.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
    setCbResponse(data.choices[0].text);
    setIsLoading(false);
  };

  return (
    <div>
      <Header />
      <Container id="chatBox">
        <Row>
          <Col>
            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
              {categories.map((item) => {
                return (
                  <ToggleButton
                    id={"tbg-radio-" + item.id}
                    size="lg"
                    variant="dark"
                    value={item.id}
                    onClick={() => setQuestionType(item.name)}
                  >
                    {item.name}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className="questionType">
              Question Type: <b>{questionType}</b>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form className="form" onSubmit={handleSendData}>
              <Form.Control
                type="text"
                value={userInput}
                size="lg"
                className="me-auto"
                placeholder="Add your question here..."
                onChange={(event) => setUserInput(event.target.value)}
              />
              <Button
                variant="dark"
                size="lg"
                type="submit"
                className="submitBtn"
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <img
              src="images/alien.png"
              alt="alienImage"
              className="alienThink"
            />
          </Col>
          <Col sm={10}>
            <div className="responseBox">
              {isLoading ? (
                <Spinner animation="border" />
              ) : cbResponse ? (
                cbResponse
              ) : (
                "No question asked."
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
