import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Text,
  Grid,
  Col,
  Title,
  Body,
  Left,
  Right,
  Row
} from "native-base";
import Expo from "expo";
import { AsyncStorage } from "react-native";

export default class App extends Component {
  state = {
    loaded: true,
    numbers: [1, 2, 3, 4, 5, 6],
    result: 0,
    highestScore: 0,
    timer: 3,
    howFast: 3,
    gamestarted: false
  };
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    }).then(() => this.setState({ loaded: false }));
  }
  componentDidMount() {
    AsyncStorage.getItem("highScore").then(value => {
      if (value !== null) {
        this.setState({ highestScore: Number(value) });
      }
    });
  }

  Clicked(number) {
    clearTimeout(this.timeout);
    this.timeout = null;

    if (number == Math.max(...this.state.numbers)) {
      if (this.state.result + 1 > this.state.highestScore) {
        this.setState(prevState => {
          return { ...prevState, highestScore: prevState.result + 1 };
        });
      }
      if (this.state.result > 0 && this.state.result % 10 === 0) {
        this.setState(prevState => {
          return { ...prevState, howFast: prevState.howFast - 0.25 };
        });
      }
      this.setState(
        prevState => {
          return {
            ...prevState,
            result: prevState.result + 1,
            timer: prevState.howFast
          };
        },
        () => this.startGame()
      );
    } else {
      alert("You lose :(");
      this.setState(prevState => {
        return {
          ...prevState,
          result: 0,
          timer: 3,
          howFast: 3,
          gamestarted: false
        };
      });
      AsyncStorage.setItem("highScore", "" + this.state.highestScore);
    }
  }
  startGame() {
    this.setState(
      prevState => {
        return {
          ...prevState,
          numbers: Array.from({ length: 6 }, () =>
            Math.floor(Math.random() * 40)
          ),
          gamestarted: true,
          timer: prevState.howFast
        };
      },
      () => this.gameTimer()
    );
  }
  gameTimer() {
    if (this.state.timer >= 0) {
      this.timeout = setTimeout(() => {
        this.setState(
          prevState => {
            return { ...prevState, timer: prevState.timer - 0.25 };
          },
          () => {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.gameTimer();
          }
        );
      }, 250);
    } else {
      this.setState({ result: 0, gamestarted: false, howFast: 3 }, () => {
        alert("time ran out :(");
        this.timeout = null;
      });
      AsyncStorage.setItem("highScore", "" + this.state.highestScore);
    }
  }
  render() {
    if (this.state.loaded) return <Container />;
    if (!this.state.gamestarted)
      return (
        <Container>
          <Header />
          <Grid>
            <Row size={2} />
            <Row>
              <Container>
                <Button danger full onPress={() => this.startGame()}>
                  <Text>Start game</Text>
                </Button>
              </Container>
            </Row>
            <Row />
          </Grid>
          <Footer>
            <FooterTab>
              <Button full>
                <Text style={{ fontSize: 16 }}>
                  Highest Score {this.state.highestScore}
                </Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      );
    return (
      <Container>
        <Header>
          <Right />
          <Body>
            <Title style={{ marginTop: 20, left: 20 }}>
              {this.state.timer > 0 && "-".repeat(this.state.timer * 4)}
            </Title>
          </Body>
          <Left />
        </Header>
        <Content>
          {this.state.numbers.map((number, index) => {
            if (index % 2 === 0) {
              return (
                <Grid key={index}>
                  <Col
                    style={{
                      backgroundColor:
                        "#" +
                        Math.random()
                          .toString(16)
                          .substr(-6),
                      height: 200,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onPress={() => this.Clicked(number)}
                  >
                    <Text
                      style={{
                        fontSize: 43,
                        color:
                          "#" +
                          Math.random()
                            .toString(16)
                            .substr(-6)
                      }}
                    >
                      {number}
                    </Text>
                  </Col>
                  <Col
                    style={{
                      backgroundColor:
                        "#" +
                        Math.random()
                          .toString(16)
                          .substr(-6),
                      height: 200,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onPress={() => this.Clicked(this.state.numbers[index + 1])}
                  >
                    <Text
                      style={{
                        fontSize: 43,
                        color:
                          "#" +
                          Math.random()
                            .toString(16)
                            .substr(-6)
                      }}
                    >
                      {this.state.numbers[index + 1]}
                    </Text>
                  </Col>
                </Grid>
              );
            }
          })}
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text style={{ fontSize: 16 }}>
                {this.state.result} -- Highest Score {this.state.highestScore}
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
