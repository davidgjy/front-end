import React, { Component } from 'react';
import update from 'react-addons-update';
import { throttle } from './utils';
import Board from './Board';
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'my'
};

export default class BoardContainer extends Component {
    constructor() {
        super();
        this.state = {
            cards: [],
        };
        this.i = 0.0;
        this.toggleTask = this.toggleTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.addTask = this.addTask.bind(this);
        // this.updateCardStatus = this.updateCardStatus.bind(this);
        // this.updateCardPosition = this.updateCardPosition.bind(this);
        this.updateCardStatus = throttle(this.updateCardStatus.bind(this), 1000);
        // Call updateCardPosition at max every 1000ms (or when arguments change)
        this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 1000);
    }
    componentDidMount() { //fetch the data when board loaded
        fetch(`${API_URL}/cards`, { headers: API_HEADERS })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({ cards: responseData });
            })
            .catch((error) => {
                console.log('Error fetching and parsing data', error);
            });
    }
    addTask(cardId, taskName) {
        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let newTask = { id: Date.now(), name: taskName, done: false };
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: { $push: [newTask] }
            }
        });

        this.setState({ cards: nextState });

        fetch(`${API_URL}/cards/${cardId}/tasks`, {
                method: 'post',
                headers: API_HEADERS,
                body: JSON.stringify(newTask)
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    // Throw an error if server response wasn't 'ok'
                    // so we can revert back the optimistic changes
                    // made to the UI.
                    throw new Error("Server response wasn't OK");
                }
            })
            .then((responseData) => {
                // When the server returns the definitive ID
                // used for the new Task on the server, update it on React
                newTask.id = responseData.id;
                this.setState({ cards: nextState });
            })
            .catch((error) => {
                this.setState(prevState);
            });
    }
    deleteTask(cardId, taskId, taskIndex) {

        let prevState = this.state;
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    $splice: [
                        [taskIndex, 1]
                    ]
                }
            }
        });
        this.setState({ cards: nextState });

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
                method: 'delete',
                headers: API_HEADERS
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Server response wasn't Ok")
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                this.setState(prevState);
            });
    }
    toggleTask(cardId, taskId, taskIndex) {
        let prevState = this.state;

        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let newDoneValue;
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {
                            $apply: (done) => {
                                newDoneValue = !done;
                                return newDoneValue;
                            }
                        }
                    }
                }
            }
        });

        this.setState({ cards: nextState });

        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
                method: 'put',
                headers: API_HEADERS,
                body: JSON.stringify({ done: newDoneValue })
            })
            .then((response) => {
                if (!response.ok) {
                    // Throw an error if server response wasn't 'ok'
                    // so we can revert back the optimistic changes
                    // made to the UI.
                    throw new Error("Server response wasn't OK")
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                this.setState(prevState);
            });
    }

    updateCardStatus(cardId, listId) {
        console.log('updateStatus ');
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        // Get the current card
        let card = this.state.cards[cardIndex];
        // Only proceed if hovering over a different list
        if (card.status !== listId) {
            // set the component state to the mutated object
            this.setState(update(this.state, {
                cards: {
                    [cardIndex]: {
                        status: { $set: listId }
                    }
                }
            }));
        }
    }

    updateCardPosition(cardId, afterId) {
        console.log('updatePosition');

        if (cardId !== afterId) {
            let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
            let card = this.state.cards[cardIndex];
            let afterIndex = this.state.cards.findIndex((card) => card.id == afterId);

            this.setState(update(this.state, {
                cards: {
                    $splice: [
                        [cardIndex, 1],
                        [afterIndex, 0, card]
                    ]
                }
            }));
        }
    }

    persistCardDrag(cardId, status) {
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let card = this.state.cards[cardIndex];

        fetch(`${API_URL}/cards/${cardId}`, {
                method: 'put',
                headers: API_HEADERS,
                body: JSON.stringify({ status: card.status, row_order_position: cardIndex })
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Server wasn't OK");
                } else {
                    console.log('drag updated');
                }
            })
            .catch((error) => {
                console.log('Fetch Error: :', error);
                this.setState(update(this.state, {
                    cards: {
                        [cardIndex]: {
                            status: { $set: status }
                        }
                    }
                }));
            });
    }
    render() {
        return (<Board cards={this.state.cards} 
                    taskCallbacks={{
                        toggle: this.toggleTask,
                        delete: this.deleteTask,
                           add: this.addTask 
                        }}
                    cardCallbacks={{
                         updateStatus: this.updateCardStatus,
                         updatePosition: this.updateCardPosition,
                          persistCardDrag: this.persistCardDrag.bind(this)
                    }}
                />);
    }
}